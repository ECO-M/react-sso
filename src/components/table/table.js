import React, {Component} from 'react';
import {Link, Route, Switch, withRouter} from 'react-router-dom';
import {Icon, Layout, Menu} from 'antd';
import Home from "../../views/home/home";
import RoleManagement from "../../views/systemManagement/roleManagement";
import ClientManagement from "../../views/clientManagement/clientManagement";
import PayClass from "../../views/payClass/payClass";
import ShopManagement from "../../views/shopManagement/shopManagement";
import StoreManagement from "../../views/storeManagement/storeManagement";
import UserManagement from "../../views/userManagement/userManagement";
import Vip from "../../views/vip/vip";
import '../../assets/table.css';

const {Sider, Content} = Layout;
const {SubMenu} = Menu;

class tableNav extends Component {
  constructor(props) {
    super(props);
    let pathname = props.location.pathname.replace("/", "");
    this.state = {
      current: pathname,
      openKeys: [pathname],
      list: [],
      collapsed: false,
    };
  }
  
  rootSubmenuKeys = ['home', 'roleList', 'clientManagement', 'payClass', 'shopManagement', 'storeManagement', 'userManagement', 'vip'];
  
  /**
   * onOpenChange 事件
   * SubMenu 展开/关闭的回调
   * @param openKeys
   */
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({
        openKeys
      });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };
  
  /**
   * click事件
   * 点击 MenuItem 调用此函数
   * @param e
   */
  onOpenClick = e => {
    this.setState({
      current: e.key,
      openKeys: e.keyPath
    });
  };
  
  /**
   * Icon
   * toggle 点击收起
   */
  
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  
  /**
   * Sider collapsible
   * onCollapse 是否可以收起
   */
  
  onCollapse = collapsed => {
    this.setState({collapsed});
  };
  
  componentDidMount() {
    // http(account + '/api/menus/' + localStorage.getItem('userNo') + '/v1', 'get').then(res => {
    //   for (let i = 0, len = res.length; i < len; i++) {
    //     res[i].route = res[i].router.path.substr(1);
    //     res[i].sonMenu.forEach((item, index) => {
    //       res[i].sonMenu[index].route = item.router.path.substr(1);
    //     })
    //   }
    //   this.setState({
    //     list: res
    //   });
    // });
    const itemList = [
      {
        name: '系统管理', route: 'systemManagement', icon: 'laptop', sonMenu: [
          {
            name: '角色列表', route: 'roleManagement', router: {
              path: '/roleManagement'
            }
          }
        ]
      },
      {
        name: '用户管理', route: 'userManagement', icon: 'user', sonMenu: [
          {
            name: '用户列表', route: 'userManagement', router: {
              path: '/userManagement'
            }
          }
        ]
      },
      {
        name: 'Crm管理', route: 'clientManagement', icon: 'desktop', sonMenu: [
          {
            name: 'Crm列表', route: 'clientManagement', router: {
              path: '/clientManagement'
            }
          }
        ]
      },
      {
        name: '支付管理', route: 'payClass', icon: 'transaction', sonMenu: [
          {
            name: '支付列表', route: 'payClass', router: {
              path: '/payClass'
            }
          }
        ]
      },
    ];
    this.setState({
      list: itemList
    });
    
  }
  
  render() {
    return (
      <Layout style={{height: 'calc(100vh - 100px)'}}>
        <Sider style={{background: '#fff', borderRight: '1px solid #e8e8e8'}} collapsible
               collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <Menu theme='light' mode="inline" selectedKeys={[this.state.current]}
                onOpenChange={this.onOpenChange}
                onClick={this.onOpenClick}>
            <div style={{textAlign: 'right', padding: '10px 0', margin: '10px 25px 0 0'}}>
              <Icon style={{fontSize: '20px'}} className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}/>
            </div>
            <Menu.Item key='home'>
              <Icon type='home' style={{fontSize: '20px'}}/>
              <Link to='/home'>首页</Link>
            </Menu.Item>
            {
              this.state.list.map((list) => {
                return (
                  <SubMenu key={list.route} title={<span><Icon type={list.icon}
                                                               style={{fontSize: '20px'}}/><span>{list.name}</span></span>}>
                    {
                      list.sonMenu.map((cList) => {
                        return (
                          <Menu.Item key={cList.route}>
                            <Link to={cList.router.path}>{cList.name}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                  </SubMenu>
                )
              })
            }
          </Menu>
        </Sider>
        <Layout>
          <Content style={{padding: 15, background: '#fff', minHeight: 280,}}>
            <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/roleManagement' component={RoleManagement}/>
              <Route path='/clientManagement' component={ClientManagement}/>
              <Route path='/payClass' component={PayClass}/>
              <Route path='/shopManagement' component={ShopManagement}/>
              <Route path='/storeManagement' component={StoreManagement}/>
              <Route path='/userManagement' component={UserManagement}/>
              <Route path='/vip' component={Vip}/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(tableNav);
