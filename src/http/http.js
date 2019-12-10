import axios from 'axios';
import Cookies from 'js-cookie'
import {baseUrl} from '../http/ip';
import {message} from 'antd'

const sendRequest = (apiName, method, data) => {
  if (!apiName) {
    return;
  }
  //验证token部分
  if (Cookies.get('token')) {
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      'Authorization': Cookies.get('token')
    };
  }
  //定义请求参数配置
  let config = {
    url: baseUrl + apiName || '',
    method: method || 'get',
    params: data || '',
    data: data || {},
  };
  
  //关于data的处理,如果后台按照序列化的标准接受就采用qs模块去处理post请求参数
  if (!data) {
    delete config.params;
    delete config.data;
  } else {
    if (method === 'get' || method === 'GET') {
      delete config.data
    } else if (method === 'post' || method === 'POST' || method === 'put' || method === 'PUT' || method === "delete" || method === "DELETE") {
      delete config.params
    }
  }
  return new Promise((resolve, reject) => {
    axios(config).then(res => {
      if (res.status === 200) {
        if (res.data.code === 200) {
          resolve(res.data);
        } else {
          message.error(res.data.message, 1.5);
          // reject(res.data);
        }
      }
    }).catch(err => {
      //错误提示
      message.error(err.data.message, 1.5);
    })
  })
};

export default sendRequest;

