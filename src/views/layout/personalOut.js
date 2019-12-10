import React, {Component} from 'react';
import Header from '../../components/header/header'
import '../../assets/less/management.less'


class personalOut extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  
  render() {
    return (
      <div className='personalCenter'>
        <Header headers={this.props}/>
        <div className="personalCenter-container">
        
        </div>
      </div>
    )
  }
}

export default personalOut;
