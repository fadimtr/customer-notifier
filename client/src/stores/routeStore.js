import { observable, computed, action } from 'mobx';
import axios from 'axios';

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if(!localStorage.getItem('jwtToken') && config.url.indexOf('/product/') == -1 && config.url.indexOf('/customerResponse/') == -1){
      let base = window.location.origin ?
      window.location.origin : (window.location.protocol + '//' +
          window.location.hostname +
              (window.location.port ? (':' + window.location.port) : ''));
      window.location.href = base + '#/login';
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

class RouteStore {

  @observable loggedInUser = { isLoggedIn : false };
  @observable jwt = '';
  @observable loginFailed = false;

  @action login = (userDetails) => {
    this.loginFailed = false;
    axios.post('http://tirapress.us-east-2.elasticbeanstalk.com/auth/login', userDetails)
        .then( action(response => {
            this.jwt = response.data.token;
            let user = response.data.user;
            localStorage.setItem('jwtToken', 'bearer ' + this.jwt);
            this.loggedInUser = Object.assign({},{isLoggedIn : true},user);
        })).catch(action(error => {
          this.loginFailed = true;
        }));
  }

  @computed get isLoggedIn(){
    let jwtToken = localStorage.getItem('jwtToken');
    return jwtToken ? true : false;
  }

  @action logOut = () => {
    this.loggedInUser = { isLoggedIn : false };
    if(localStorage.getItem('jwtToken')){
      localStorage.removeItem('jwtToken');
    }
    let base = window.location.origin ? window.location.origin : 
                (window.location.protocol + '//' +  window.location.hostname + (window.location.port ? (':' + window.location.port) : ''));
    window.location.href = base + '#/login';
  }

  @action initLoggedInUser = () => {
      let jwtToken = localStorage.getItem('jwtToken');
      if(!jwtToken){
        return;
      }
      let parsedToken = this.parseJwt(jwtToken);
      this.loggedInUser = Object.assign({},{isLoggedIn : true},parsedToken);
  }

  parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

}

export default new RouteStore();