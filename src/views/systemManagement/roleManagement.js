import React, {Component} from 'react'
import http from '../../http/http'
import {Table, Switch, Icon, Button, Drawer, message, Form, Input, Select, Popconfirm} from 'antd';
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import '../../assets/less/management.less'

const {Option} = Select;

class roleManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sex: [
        {name: '男', value: 1, key: 1},
        {name: '女', value: 2, key: 2}
      ],
      store: [
        {name: '高级', value: 1, key: 1},
        {name: '普通', value: 2, key: 2}
      ],
      status: [
        {name: '启用', value: 1, key: 1},
        {name: '禁用', value: 2, key: 2}
      ],
      sexVal: 1,
      roleVal: 1,
      statusVal: 1,
      title: '',
      message: '',
      data: [],
      row: [],
      crumd: [],
      visible: false,
      total: '',
      pageSize: 10,
      page: 1
    };
    this.columns = [
      {
        title: '序号',
        align: "center",
        dataIndex: 'id',
      },
      {
        title: '角色名',
        align: "center",
        dataIndex: 'roleName',
      },
      {
        title: '手机号',
        align: "center",
        dataIndex: 'iphone',
      },
      {
        title: '性别',
        align: "center",
        dataIndex: 'sex',
        render: (text, record) => {
          const sex = (record.sex === 1 && '男') || (record.sex === 2 && '女');
          return sex;
        }
      },
      {
        title: '角色',
        align: "center",
        dataIndex: 'store',
        render: (text, record) => {
          const store = (record.store === 1 && '高级') || (record.store === 2 && '普通');
          return store;
        }
      },
      {
        title: '状态',
        align: "center",
        dataIndex: 'status',
        render: (text, record) => {
          const checked = (record.status === 2 && false) || (record.status === 1 && true);
          return <Switch defaultChecked={checked} checked={checked} onClick={() => this.switchClick(checked, record)}/>;
        },
      },
      {
        title: '操作',
        dataIndex: 'button',
        align: "center",
        width: '180px',
        render: (text, record) => (
          <span>
             <Popconfirm title="你确定要删除吗?" onConfirm={() => this.danger(record)}>
            <Button size="small" type="danger" icon="close" style={{marginRight: '10px'}}>
                删除
            </Button>
            </Popconfirm>
            <Button size="small" onClick={() => this.edit(record)} type="primary"
                    icon="edit">修改</Button>
          </span>
        )
      }
    ];
  }
  
  switchClick = (checked, record) => {
    const status = (checked === false && 1) || (checked === true && 2);
    const information = (status) => {
      if (status === 1) message.success('已启用', 1.5);
      if (status === 2) message.warning('已禁用', 1.5);
    };
    let json = {
      id: record._id,
      status: status
    };
    http('/editRole', 'post', json).then(() => {
      information(status);
      this.tableData();
    });
  };
  
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      let json = {
        roleName: fieldsValue.roleName,
        iphone: fieldsValue.iphone,
        sex: fieldsValue.sex,
        store: fieldsValue.store,
        status: fieldsValue.status
      };
      const addRole = () => {
        json.userName = fieldsValue.userName;
        json.password = fieldsValue.password;
        http('/addRole', 'post', json).then((res) => {
          message.success(res.message, 1.5);
          this.setState({
            visible: false,
          });
          this.tableData();
        });
      };
      const editRole = () => {
        json.id = this.state.row._id;
        http('/editRole', 'post', json).then((res) => {
          message.success(res.message, 1.5);
          this.setState({
            visible: false,
          });
          this.tableData();
        });
      };
      this.state.title === '新增角色' && addRole();
      this.state.title === '修改角色' && editRole();
    });
  };
  
  edit(row) {
    this.props.form.setFieldsValue(
      {
        roleName: row.roleName,
        iphone: row.iphone,
        sex: row.sex,
        store: row.store,
        status: row.status
      }
    );
    this.setState({
      visible: true,
      row: row,
      title: '修改角色',
      sexVal: row.sex,
      roleVal: row.store,
      statusVal: row.status
    });
  }
  
  newAdd(e) {
    this.props.form.setFieldsValue(
      {
        sex: 1,
        store: 1,
        status: 1,
      }
    );
    this.props.form.resetFields(['userName', 'roleName', 'password', 'iphone'], []);
    this.setState({
      visible: true,
      title: '新增角色',
      sexVal: 1,
      roleVal: 1,
      statusVal: 1,
    });
  }
  
  danger(row) {
    http('/deleteRole', 'post', {id: row._id}).then(res => {
      message.success(res.message, 1.5);
      this.tableData();
    })
  }
  
  componentDidMount() {
    this.setState({
      visible: false
    });
    let bread = [
      {
        id: 1,
        name: '',
        path: '/home',
        icon: 'home'
      },
      {
        id: 2,
        name: '角色列表',
        path: '',
        icon: 'laptop'
      }
    ];
    this.setState({
      crumd: bread
    });
    this.tableData();
  }
  
  onChange = (page, pageSize) => {
    this.setState({
      page: page
    });
    this.tableData(page, pageSize);
  };
  
  onShowSizeChange = (page, pageSize) => {
    this.setState({
      pageSize: pageSize
    });
    this.tableData(1, pageSize);
  };
  
  tableData = (page, pageSize) => {
    let json = {
      page: page || 1,
      pageSize: pageSize || 10,
    };
    http('/roleManagement', 'post', json).then(res => {
      for (let i = 0, len = res.list.length; i < len; i++) {
        let is = i + 1;
        json.page === 1 ? res.list[i].id = is : res.list[i].id = (json.page * json.pageSize) - 10 + is;
      }
      this.setState({
        data: res.list,
        total: res.total
      });
    })
  };
  
  handleChange = (val) => {
    this.setState({
      sexVal: val
    })
  };
  
  handleChangeRole = (val) => {
    this.setState({
      roleVal: val
    });
  };
  handleChangeStatus = (val) => {
    this.setState({
      statusVal: val
    });
  };
  
  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
        offset: 2
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    return (
      <div className="roleManagement">
        <Breadcrumb bread={this.state.crumd}/>
        <div className="roleManagement-square">
          <Button type="primary" size="small" onClick={() => this.newAdd()} icon="plus-circle">新增</Button>
        </div>
        <Table rowKey={record => record.id} columns={this.columns} dataSource={this.state.data} pagination={{
          simple: false,
          onChange: this.onChange,
          onShowSizeChange: this.onShowSizeChange,
          showSizeChanger: true,
          pageSize: this.state.pageSize,
          current: this.state.page,
          total: this.state.total,
          // pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return "共 " + total + " 条"
          },
        }}/>
        <Drawer title={this.state.title} width={'45%'} closable={false}
                onClose={this.onClose}
                visible={this.state.visible}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
            {
              this.state.title === '新增角色' ?
                <Form.Item label={<span><Icon type="user" style={{fontSize: '16px'}}/>&nbsp;用户名</span>}>
                  {getFieldDecorator('userName', {
                    rules: [{required: true, message: '请输入用户名!'}],
                  })(<Input placeholder="请输入用户名"/>)}
                </Form.Item> : ''
            }
            <Form.Item label={<span><Icon type="user-add" style={{fontSize: '16px'}}/>&nbsp;角色名</span>}>
              {getFieldDecorator('roleName', {
                rules: [{required: true, message: '请输入角色名!'}],
              })(<Input placeholder="请输入角色名"/>)}
            </Form.Item>
            {
              this.state.title === '新增角色' ?
                <Form.Item label={<span><Icon type="eye" theme="filled" style={{fontSize: '16px'}}/>&nbsp;密码</span>}>
                  {getFieldDecorator('password', {
                    rules: [{required: true, message: '请输入密码!'}],
                  })(<Input type="password" placeholder="请输入密码"/>)}
                </Form.Item> : ''
            }
            <Form.Item label={<span><Icon type="phone" style={{fontSize: '16px'}}/>&nbsp;手机号码</span>}>
              {getFieldDecorator('iphone', {
                rules: [{required: true, message: '请输入手机号码!'}],
              })(<Input placeholder="请输入手机号码"/>)}
            </Form.Item>
            <Form.Item label={<span><Icon type={this.state.sexVal === 1 ? 'man' : 'woman'}
                                          style={{fontSize: '16px'}}/>&nbsp;性别</span>} hasFeedback>
              {getFieldDecorator('sex', {
                rules: [{required: true, message: '请选择性别!'}],
              })(<Select onChange={this.handleChange} placeholder="请选择性别">
                {this.state.sex.map((sex) =>
                  <Option key={sex.key} value={sex.value}>{sex.name}</Option>
                )}
              </Select>)}
            </Form.Item>
            <Form.Item label={<span><Icon type='star' theme={this.state.roleVal === 1 ? 'twoTone' : ''}
                                          style={{fontSize: '16px'}}/>&nbsp;角色</span>} hasFeedback>
              {getFieldDecorator('store', {
                rules: [{required: true, message: '请选择角色!'}],
              })(<Select onChange={this.handleChangeRole} placeholder="请选择角色">
                {this.state.store.map((store) =>
                  <Option key={store.key} value={store.value}>{store.name}</Option>
                )}
              </Select>)}
            </Form.Item>
            <Form.Item label={<span><Icon type={this.state.statusVal === 1 ? 'check-circle' : 'info-circle'}
                                          theme={this.state.statusVal === 1 ? 'twoTone' : ''}
                                          style={{fontSize: '16px'}}/>&nbsp;状态</span>} hasFeedback>
              {getFieldDecorator('status', {
                rules: [{required: true, message: '请选择状态!'}],
              })(<Select onChange={this.handleChangeStatus} placeholder="请选择状态">
                {this.state.status.map((status) =>
                  <Option key={status.key} value={status.value}>{status.name}</Option>
                )}
              </Select>)}
            </Form.Item>
            <div style={{textAlign: 'center', width: '100%'}}>
              <Button style={{marginRight: 8,}} onClick={this.onClose}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </div>
          </Form>
        </Drawer>
      </div>
    )
  }
}

const roleListForm = Form.create({name: 'roleListForm'})(roleManagement);

export default roleListForm;
