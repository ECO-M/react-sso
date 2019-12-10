import React, {Component} from 'react'
import http from '../../http/http'
import {Table} from 'antd';
import Breadcrumb from "../../components/breadcrumb/breadcrumb";

class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {data: [], crumd: [], total: '', pageSize: 10, currentPage: 1};
    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '头像',
        dataIndex: 'avatar',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: (text, record) => {
          const sex = (record.sex === 1 && '男') || (record.sex === 2 && '女');
          return sex;
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          const status = (record.status === 1 && '禁止') || (record.status === 2 && '启用');
          return status;
        }
      },
    ];
  }
  
  componentDidMount() {
    let bread = [
      {
        id: 1,
        name: '',
        path: '/home',
        icon: 'home'
      },
      {
        id: 2,
        name: '用户列表',
        path: '',
        icon: 'user'
      }
    ];
    this.setState({
      crumd: bread
    });
    this.TableData();
  }
  
  onChange = (currentPage, pageSize) => {
    this.setState({
      currentPage: currentPage
    });
    this.TableData(currentPage, pageSize);
  };
  
  onShowSizeChange = (currentPage, pageSize) => {
    this.setState({
      pageSize: pageSize
    });
    this.TableData(1, pageSize);
  };
  
  TableData = (currentPage, pageSize) => {
    // let json = {
    //   pageNo: currentPage || 1,
    //   maxResults: pageSize || 10,
    //   param:{
    //     merchantNo:localStorage.getItem('merchantNo')
    //   }
    // };
    // http(merchanism + '/api/store/user/search', 'post', json).then(res => {
    //   for (let i = 0, len = res.dataList.length; i < len; i++) {
    //     let is = i + 1;
    //     json.pageNo === 1 ? res.dataList[i].id = is : res.dataList[i].id = (json.pageNo * json.maxResults) - 10 + is;
    //   }
    //   this.setState({
    //     data: res.dataList,
    //     total: res.rowCount
    //   });
    // })
  };
  
  render() {
    return (
      <div className="table">
        <Breadcrumb bread={this.state.crumd}/>
        <Table rowKey={record => record.id} columns={this.columns} dataSource={this.state.data} pagination={{
          simple: false,
          onChange: this.onChange,
          onShowSizeChange: this.onShowSizeChange,
          showSizeChanger: true,
          pageSize: this.state.pageSize,
          current: this.state.currentPage,
          total: this.state.total,
          // pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return "共 " + total + " 条"
          },
        }}/>
      </div>
    )
  }
}

export default UserManagement;
