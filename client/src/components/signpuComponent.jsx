import React , { Component } from 'react';
import { observer , inject } from 'mobx-react';

@inject('RouteStore') @observer
class Signup extends Component {
    state = {

    }


    render() { 
        return <div className='signup-wrapper'>
        
        </div>
    }
}
 
export default Signup;