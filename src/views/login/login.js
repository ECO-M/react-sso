import React, {Component} from 'react';
import forge from 'node-forge'
import Cookies from 'js-cookie'
import http from '../../http/http';
import {Form, Icon, Input, Button, Checkbox, notification, message} from 'antd';
import '../../assets/App.css';

let form;
const CustomizedForm = Form.create({
  //全局状态 global_state
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  
  mapPropsToFields(props) {
    return {
      username: Form.createFormField({
        ...props.username,
        value: props.username.value,
      }),
      password: Form.createFormField({
        ...props.password,
        value: props.password.value,
      }),
      remember: Form.createFormField({
        ...props.remember,
        value: props.remember.value,
      }),
    };
  },
  
  onValuesChange(_, values) {
  
  },
  
})((props) => {
  form = props.form;
  const {getFieldDecorator} = props.form;
  let val = props.remember.value;
  return (
    <Form onSubmit={props.onSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{required: true, message: 'Please input your username!'}],
        })(
          <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username"/>
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{required: true, message: 'Please input your Password!'}],
        })(
          <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                 placeholder="Password"/>
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: val,
        })(
          <Checkbox>Remember me</Checkbox>
        )}
        <a className="login-form-forgot" href="/forgotPassword">Forgot password</a>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="/register">register now!</a>
      </Form.Item>
    </Form>
  );
});

class Login extends Component {
  state = {
    fields: {
      username: {
        value: '',
      },
      password: {
        value: ''
      },
      remember: {
        value: true
      }
    },
  };
  
  componentDidMount() {
    if (Cookies.get('token')) {
      this.props.history.push('/home');
    } else {
      this.props.history.push('/');
    }
  }
  
  handleFormChange = (changedFields) => {
    this.setState(({fields}) => ({
      fields: {...fields, ...changedFields},
    }));
  };
  
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.fields.remember.value === false) {
      notification.open({
        message: 'notice of settlement',
        duration: 2,
        description: 'Please select protocol.',
        icon: <Icon type="smile" rotate={180} style={{color: 'red', fontSize: '26px', position: 'absolute'}}/>,
      });
      return;
    }
    let json, login = this.state.fields;
    /**
     * node-forge RSA 公钥
     * @type {string}
     */
    const publicKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqM+l9ZWy1Frt6felFFLmfZNls\nVbU1dKpF8Rx83FtKCsztO5k/iV5N9BbfHFUg9Y40b/EK2j/BPc1xlLYAHMXn6563\nXCwZ4IuCxvfOwz9qT9gkKBxkI5b0rnikkSWTGlJEk2PdZ7Plc73Fa+bx3PvuKvMd\ncKWvd80+vt9+b/7hrwIDAQAB\n-----END PUBLIC KEY-----';
    const publicK = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = publicK.encrypt(encodeURIComponent(login.password.value), 'RSA-OAEP');
    json = {
      account: login.username.value,
      password: encrypted,
      platformType: 1
    };
    form.validateFields((err, values) => {
      if (!err) {
        http('/login', 'post', json).then(res => {
          Cookies.set('token', res.data.token, {expires: 7});
          Cookies.set('user', res.data.data, {expires: 7});
          // localStorage.setItem('token', res.data.token);
          message.success(res.data.message, 0.6);
          this.props.history.push('/home');
        });
      }
    });
  };
  
  render() {
    const fields = this.state.fields;
    return (
      <div className="App">
        <header className="App-header" id="components-form-demo-normal-login">
          <h1 className="App-link">SSO</h1>
          <CustomizedForm {...fields} onChange={this.handleFormChange} onSubmit={this.handleSubmit}/>
        </header>
      </div>
    );
  }
}


export default Login;
