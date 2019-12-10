import React, {Component} from 'react';
import Cookies from 'js-cookie'
import Table from '../../components/table/table'
import Header from '../../components/header/header'

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  
  /**
   * 验证 token
   */
  componentDidMount() {
    // console.log(JSON.parse(Cookies.get('user')));
    // const error = () => {
    //   message.error('请先登陆！', 1.5);
    //   this.props.history.push('/');
    // };
    // !localStorage.getItem('token') && error();
  }
  
  render() {
    return (
      <div className="back-root">
        <Header headers={this.props}/>
        <Table/>
      </div>
    )
  }
}

export default Layout;
