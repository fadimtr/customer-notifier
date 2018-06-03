import React , { Component } from 'react';
import { observer , inject } from 'mobx-react';

@inject('RouteStore') @observer
class Login extends Component {
    state = {
        userName :'',
        password: ''
    }

    login(){

        let details = {
            username:this.state.userName,
            password:this.state.password
        }

        this.props.RouteStore.login(details);

        if(this.props.RouteStore.loggedInUser.isLoggedIn){
            this.props.history.replace('/home');
        }
    }

    render() { 

        if(this.props.RouteStore.loggedInUser.isLoggedIn){
            this.props.history.replace('/home');
        }
        
        return (<div className='login-page'>
                    <div className='login-form'>
                        <div className='login-logo'><span className='logo-image'/></div>
                        <form onSubmit= {(e) => {e.preventDefault(); this.login()}}>
                            <div className='form-inputs'>
                                <input type='text' name='username' placeholder='שם משתמש' value={this.state.userName} onChange={(e) => this.setState({userName: e.target.value})}/>
                                <input type='password' name='password' placeholder='סיסמה' value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
                            </div>
                            <button type='submit'>התחבר</button>
                        </form>
                        { this.props.RouteStore.loginFailed ? <span className='login-error-message'>שם משתמש או סיסמה אינם נכונים.</span> : ''}
                        {/* <span className='signup'><a href='#/signup'>הירשם</a></span> */}
                    </div>
                </div>)
    }
}
 
export default Login;