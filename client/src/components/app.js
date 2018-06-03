import React , { Component } from 'react';
import { HashRouter as Router, Route, Link, Redirect, withRouter, Switch} from 'react-router-dom';
import PrivateRoute from './routes/privateRouteComponent';
import HomePage from './homePageComponent';
import Login from './loginComponent';
import Signup from './signpuComponent';
import Product from './productComponent';
require('es6-promise').polyfill();

class App extends Component {
    state = {}
    render() { 
        return (<Router>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} />
                        <Route path='/products/:clientId' component={Product} />
                        <Route path='/home/' render = {() => <PrivateRoute path="/home" component={HomePage} />}/>
                        <Redirect from='/' to='login'/>
                    </Switch>
                </Router> );
    }
}
 
export default App;