import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {Icon, message, Avatar, Menu, Dropdown, Tooltip, Badge} from 'antd';
import Cookies from 'js-cookie'
import matchesSelector from '../../modules/matchesSelector/matchesSelector'
import ssoURL from '../../images/SSO-Icon.png';
import '../../assets/header.css';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
      avatar: '',
      message: false
    }
  }
  
  componentDidMount() {
    if (Cookies.get('user')) {
      let user = JSON.parse(Cookies.get('user'));
      this.setState({
        avatar: user.avatar,
        // message:true
      });
    } else {
      message.error('请先登陆！', 1.5);
      this.props.headers.history.push('/');
    }
    this.clicks(this);
  }
  
  //组件销毁时 撤销this.clicks(this)
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return false;
    };
  }
  
  /**
   * clicks
   * @param self
   * 点击当前元素外的dom层,改变this.state of status value
   * 点击当前元素外的dom层,改变className style attr of value
   */
  clicks = (self) => {
    document.body.addEventListener('click', (e) => {
      ////匹配当前组件内的所有元素
      if (matchesSelector(e.target, '.relative-setting *')) {
        return;
      }
      self.setState({
        status: false,
      });
    }, false);
  };
  
  //注销
  logout = (e) => {
    e.preventDefault();
    Cookies.remove('token');
    Cookies.remove('user');
  };
  
  // card_setting
  // let divClass = classNames({
  //     "card-setting": true,
  //     "active": this.state.status === true,
  //     "close": this.state.status === false
  //   });
  render() {
    const menu = (
      <Menu style={{top: '5px', textAlign: 'center'}}>
        <Menu.Item key="0">
          <Tooltip placement="left" title='个人中心' overlayClassName="header-tooltip"><Link to="/personalCenter"><Icon
            style={{color: '#333333'}} type="user"/></Link></Tooltip>
        </Menu.Item>
        <Menu.Item key="1">
          <Tooltip placement="left" title='管理中心' overlayClassName="header-tooltip"><Link to="/home"><Icon
            style={{color: '#333333'}} type="laptop"/></Link></Tooltip>
        </Menu.Item>
        <Menu.Item key="2">
          <Tooltip placement="left" title='消息通知' overlayClassName="header-tooltip"><Link to="/messageNotification">
            <Badge dot={this.state.message}><Icon
              style={{color: '#333333'}} type="notification"/></Badge></Link></Tooltip>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="3">
          <Tooltip placement="left" title='退出登陆' overlayClassName="header-tooltip"><Link to="/" onClick={this.logout}><Icon
            style={{color: '#999999'}} type="poweroff"/></Link></Tooltip>
        </Menu.Item>
      </Menu>
    );
    return (
      <header className='nav-header'>
        <div className="nav-images">
          <img src={ssoURL} alt="sso"/>
        </div>
        <div className="nav-background">
        </div>
        <div className="nav-setting">
          <Dropdown overlay={menu} placement="bottomCenter">
            {
              this.state.avatar ?
                <Badge dot={this.state.message}><Avatar style={{verticalAlign: 'middle'}} size="large"
                                                        src={this.state.avatar}/></Badge> :
                <Avatar style={{verticalAlign: 'middle'}} size="large" icon="user"/>
            }
          </Dropdown>
        </div>
      </header>
    )
  }
}

export default Header;
