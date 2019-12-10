import React, {Component} from 'react'
import {Link} from 'react-router-dom';
import {Breadcrumb, Icon} from 'antd';
import './style/breadcrumb.css'

class Bread extends Component {
  
  render() {
    return (
      <div className="table-breadcrumb">
        <Breadcrumb>
          {
            this.props.bread.map((item) => {
              return (
                item.path.length > 0 ? <Breadcrumb.Item key={item.id}>
                    <Link to={item.path}>
                      <Icon type={item.icon}/>
                      <span style={{marginLeft: '5px'}}>{item.name}</span>
                    </Link>
                  </Breadcrumb.Item> :
                  <Breadcrumb.Item key={item.id}>
                    <Icon type={item.icon}/>
                    <span>{item.name}</span>
                  </Breadcrumb.Item>
              )
            })
          }
        </Breadcrumb>
      </div>
    )
  }
}

export default Bread;
