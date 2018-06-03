import { observable, computed, action } from 'mobx';
import RouteStore from './routeStore';
import request from 'superagent';
import axios from 'axios';

class ProductsStore {

    @observable products = [];
    @observable productsLoaded = false;
    @observable requestedProduct = {};
    @observable notifyDoneAction = { toNotify : false , type: 'success' , message : ''};
    @observable productAdded = { id: '', isAdded: false};
    @observable isEmailSent = {isSent : false , error : null};
    @observable isSMSSent = {isSent : false , error : null};
    @observable isCustomerResponseSent = {isSent : false , error : null};
    @observable isFilesUploaded = {uploaded : false , error : null};
    @observable addProductFullActionSucceeded = true;

    @action getAll = () => {
        let token = localStorage.getItem('jwtToken') || '';
        axios.get('http://localhost:8081/products',{ headers:{ Authorization : token } })
        .then( response => {
            this.products = response.data;
            this.productsLoaded = true;
        })
        .catch(error => {
            if(error.response.status == 401){
                RouteStore.logOut();
            }else{
                throw(error);
            }
        });
    }


    @action getProduct = (clientId) => {
        let token = localStorage.getItem('jwtToken') || '';
        axios.get('http://localhost:8081/product/' + clientId,{ headers:{ Authorization : token } })
        .then( response => this.requestedProduct = response.data);
    }

    @action uploadFilesAndAddProduct = (product,toSendEmail,toSendSMS,filesToUpload) => {
        this.addProductFullActionSucceeded = true;
        this.isFilesUploaded = {uploaded : false , error : null};
        let token = localStorage.getItem('jwtToken') || '';
        var req = request.post('http://localhost:8081/products/uploadProductFiles');
        req.set('Authorization' , token);
        for(var i=0;i<filesToUpload.length;i++){
            req.attach('files',filesToUpload[i]);
        }
        req.end((err,res) => {
            if(err){
                this.isFilesUploaded = {uploaded : true , error : 'failed'};
                this.addProductFullActionSucceeded = false;
            }else{
                product.uploadedFiles = res.body;
                this.isFilesUploaded = {uploaded : true , error : null};
                this.addProduct(product,toSendEmail,toSendSMS);
            }
          });
    }

    @action addProduct = (product,toSendEmail,toSendSMS) => {
        this.addProductFullActionSucceeded = true;
        let token = localStorage.getItem('jwtToken') || '';
        axios.post('http://localhost:8081/products',product,{ headers:{ Authorization : token } })
        .then( response => {
            this.productAdded = { id: product.id , isAdded : true};
            this.notifyDoneAction = { toNotify : true , type: 'success' , message : 'Product added successfully!'};
            if(toSendEmail){
                this.sendEmail(response.data);
            }
            if(toSendSMS){
                this.sendSMS(response.data);
            }
            this.getAll();
        }).catch(err => {
            this.notifyDoneAction = { toNotify : true , type: 'error' , message : 'Failed to add product!'};
            this.addProductFullActionSucceeded = false;
        });
    }

    @action sendEmail = (id) => {
        let token = localStorage.getItem('jwtToken') || '';
        axios.post('http://localhost:8081/notification/email',{"id":id},{ headers:{ Authorization : token } })
        .then( response => {
            this.isEmailSent = {isSent : true , error : null};
            this.notifyDoneAction = { toNotify : true , type: 'success' , message : 'Email sent successfully!'};
        })
        .catch( error => {
            this.isEmailSent = {isSent: true , error : 'Failed to send email'};
            this.notifyDoneAction = { toNotify : true , type: 'error' , message : 'Failed to send email!'};
        });
    }

    @action sendSMS = (id) => {
        let token = localStorage.getItem('jwtToken') || '';
        axios.post('http://localhost:8081/notification/sms',{"id":id},{ headers:{ Authorization : token } })
        .then( response => {
            this.isSMSSent = {isSent : true , error : null};
            this.notifyDoneAction = { toNotify : true , type: 'success' , message : 'SMS sent successfully!'};
        })
        .catch( error => {
            this.isSMSSent = {isSent: true , error : 'Failed to send sms'};
            this.notifyDoneAction = { toNotify : true , type: 'error' , message : 'Failed to send SMS!'};
        });
    }

    @action approveProduct = (message) => {
        let body = {
            message,
            product: this.requestedProduct
        };
        axios.post('http://localhost:8081/customerResponse/approve',body)
        .then( response => this.isCustomerResponseSent = {isSent : true , error : null})
        .catch( error => this.isCustomerResponseSent = {isSent: true , error : 'Failed to send sms'});
    }

    @action changeProductRequest = (message) => {
        let body = {
            message,
            product: this.requestedProduct
        };
        axios.post('http://localhost:8081/customerResponse/changeRequest',body)
        .then( response => this.isCustomerResponseSent = {isSent : true , error : null})
        .catch( error => this.isCustomerResponseSent = {isSent: true , error : 'Failed to send sms'});
    }

    @action stopNotification = () => {
        this.notifyDoneAction = { toNotify : false , type: 'success' , message : ''};
    }
}

export default new ProductsStore();