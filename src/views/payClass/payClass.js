import React, {Component} from 'react'
import Breadcrumb from "../../components/breadcrumb/breadcrumb";

class PayClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crumd: []
    }
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
        name: '支付列表',
        path: '',
        icon: 'transaction'
      }
    ];
    this.setState({
      crumd: bread
    })
  }
  
  render() {
    return (
      <div>
        <Breadcrumb bread={this.state.crumd}/>
      </div>
    )
  }
}

export default PayClass;
