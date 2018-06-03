import React from "react";
import { Route,  Redirect } from "react-router-dom";
import { observer , inject } from 'mobx-react';

@inject('RouteStore')
class PrivateRoute extends React.Component{

  render(){
    let Component = this.props.component;

    if(this.props.RouteStore.isLoggedIn){
      this.props.RouteStore.initLoggedInUser();
    }

    return <Route path="/home" render={props => this.props.RouteStore.isLoggedIn ? (<Component/>) : (<Redirect to='/login'/>)}/>
  }

};

  export default PrivateRoute;