import React , { Component } from 'react';
import { observer , inject } from 'mobx-react';
import Dropzone from 'react-dropzone'
import Modal from 'react-responsive-modal';
import 'font-awesome/css/font-awesome.min.css';

@inject('ProductsStore','RouteStore') @observer
class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = { modalOpen: false,
            formValid:false,
            isSending:false,
            isPictureLink : false,
            filesToUpload : [],
            attachmentType : 'upload'
        }
    }

    onOpenModal = () => {
        this.setState({ modalOpen: true });
    };
    
    onCloseModal = () => {
        this.setState({ modalOpen: false });
    };

    updatePhoneField(value){
        if(value == '' && (!this.state.email || (this.state.email && this.state.email == '') )){
            this.setState({phoneNumber: value, formValid:false});
        }else{
            this.setState({phoneNumber: value, formValid: true});
        }
    }

    updateEmailField(value){
        if(value == '' && (!this.state.phoneNumber || (this.state.phoneNumber && this.state.phoneNumber == '') )){
            this.setState({email: value, formValid:false});
        }else{
            this.setState({email: value, formValid: true});
        }
    }

    isFormValid(){
        let isFormValid = this.state.formValid;
        let newValue =  (this.state.phoneNumber && this.state.phoneNumber != '') ||
                        (this.state.email && this.state.email != '');
                //        (this.state.customerName && this.state.customerName != '') &&
                 //       (this.state.pictureLink && this.state.pictureLink != '');
        if(isFormValid != newValue){
            this.setState({formValid:newValue});
        }

        return newValue;
    }

    isFileExist(){
        return (this.state.link && this.state.link != '') || this.state.filesToUpload.length > 0;
    }

    addProduct(){

        if(!this.state.formValid){
            return;
        }

        const product = {
            productId:this.state.productId || '',
            customer: this.state.customerName || '',
            messageSubject: this.state.messageSubject || '',
            message:this.state.message || '',
            link : this.state.link || '',
            phone : this.state.phoneNumber || '',
            email : this.state.email || '',
            createdBy : this.props.RouteStore.loggedInUser.email,
            attachmentType : this.isFileExist() ? (this.state.isPictureLink ? 'picture' : 'file') : 'none'
        }

        let toSendEmail = false,
            toSendSMS = false; 
        if(this.state.email && this.state.email != ''){
            toSendEmail = true;
          //  this.props.ProductsStore.sendEmail(product);
        }
        if(this.state.phoneNumber && this.state.phoneNumber != ''){
            toSendSMS = true;
            // this.props.ProductsStore.sendSMS(product);
        }

        if(this.state.filesToUpload.length == 0){
            this.props.ProductsStore.addProduct(product,toSendEmail,toSendSMS);
        }else{
            this.props.ProductsStore.uploadFilesAndAddProduct(product,toSendEmail,toSendSMS,this.state.filesToUpload);
        }

        this.setState({
            isSending:true
        });
        

    }

    sendAgain = () => {
        if(this.props.ProductsStore.addProductFullActionSucceeded == true){
            this.setState({ 
                modalOpen: false,
                formValid: false,
                productId: '',
                messageSubject: '',
                message:'',
                email:'',
                phoneNumber:'',
                link:'',
                customerName: '',
                filesToUpload : [],
                isSending: false
            });
        }else{
            this.setState({
                isSending : false
            });
        }
    }

    isSendAgainButtonEnabled = () => {
        if(this.props.ProductsStore.addProductFullActionSucceeded == false){
            return true;
        }

        if(this.state.email && this.state.email != '' && this.state.phoneNumber && this.state.phoneNumber != ''){
            return this.props.ProductsStore.isEmailSent.isSent && this.props.ProductsStore.isSMSSent.isSent;
        }

        if(this.state.email && this.state.email != ''){
            return this.props.ProductsStore.isEmailSent.isSent;
        }

        if(this.state.phoneNumber && this.state.phoneNumber != ''){
            return this.props.ProductsStore.isSMSSent.isSent;
        }

        return true;
        
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
        // do stuff with files...
        this.setState({
            filesToUpload : acceptedFiles
        });
    }

    render() { 
        let wrapperClassName = this.props.RouteStore.loggedInUser.isAdmin ? 'admin-page' : '';
        return ( 
            <span className={`add-product-wrapper ${wrapperClassName}`}>
                { this.state.isSending ? 
                    <div className='sending-product'>
                        <ul>
                        { this.state.filesToUpload.length == 0 ? '' : !this.props.ProductsStore.isFilesUploaded.uploaded ?
                                <li>
                                    <span className='loader'/>
                                    מעלה קבצים
                                </li> : this.props.ProductsStore.isFilesUploaded.error ?
                                <li>
                                    <i className="fa fa-times-circle"/>
                                    נכשל להעלות את הקבצים.
                                </li> :
                                <li>
                                    <i className="fa fa-check-circle"/>
                                    הקבצים הועלו בהצלחה
                                </li>
                        }
                        { this.state.email && this.state.email != '' ? 
                            !this.props.ProductsStore.isEmailSent.isSent ?
                                <li>
                                    <span className='loader'/>
                                    שולח מייל
                                </li> :
                                <li>
                                    <i className="fa fa-check-circle"/>
                                    המייל נשלח בהצלחה
                                </li>
                              : ''}
                        { this.state.phoneNumber && this.state.phoneNumber != '' ? 
                            !this.props.ProductsStore.isSMSSent.isSent ?
                                <li>
                                    <span className='loader'/>
                                    שולח הודעת SMS
                                </li> :
                                <li>
                                    <i className="fa fa-check-circle"/>
                                    ההודעה נשלחה בהצלחה
                                </li>
                              : ''}
                        { this.isSendAgainButtonEnabled() ? <li className='send-again'>
                                                                            <span onClick={this.sendAgain.bind(this)} className='send-again-button'>
                                                                                {this.props.ProductsStore.addProductFullActionSucceeded ? 'שלח מוצר אחר' : 'נכשל, נסה שוב'}</span>
                                                                        </li> : ''}
                        </ul>
                    </div>
                    : <div className='add-product-form'>
                        <form onSubmit= {(e) => {e.preventDefault(); this.addProduct()}}>
                            <div className='form-inputs'>
                                <span className='form-group'>
                                    <label>מספר הזמנה</label>
                                    <input type='text' name='productId' value={this.state.productId} 
                                            onChange={(e) => this.setState({productId: e.target.value}) }/>
                                </span>
                                <span className='form-group'>
                                    <label>לקוח</label>
                                    <input type='text' name='customerName' value={this.state.customerName} 
                                            onChange={(e) => this.setState({customerName: e.target.value}) }/>
                                </span>
                                <span className='form-group'>
                                    <label>נושא ההודעה</label>
                                    <input type='text' name='customerName' value={this.state.messageSubject} 
                                            onChange={(e) => this.setState({messageSubject: e.target.value}) }/>
                                </span>
                                <span className='form-group'>
                                    <label>תוכן ההודעה</label>
                                    <textarea rows='3' name='message' value={this.state.message} 
                                            onChange={(e) => this.setState({message: e.target.value})}/>
                                </span>
                                <span className='form-group'>
                                    <label>קבצים מצורפים 
                                        <span className='radio-option'>
                                            <input type="radio" value="upload" checked={this.state.attachmentType == 'upload'} onChange={(e) => this.setState({ attachmentType : e.target.value ? 'upload' : 'link'})}/>
                                            העלאה
                                        </span>
                                        <span className='radio-option'>
                                            <input type="radio" value="link" checked={this.state.attachmentType == 'link'} onChange={(e) => this.setState({ attachmentType : e.target.value ? 'link' : 'upload'})}/>
                                            קישור
                                        </span>
                                    </label>
                                        { this.state.attachmentType == 'link' ? 
                                            <input type='text' name='link' value={this.state.link} 
                                                onChange={(e) => this.setState({link: e.target.value})}/> :
                                            <Dropzone className='files-dropzone' onDrop={this.onDrop.bind(this)}>
                                                { 
                                                    this.state.filesToUpload.length == 0 ? <p>גרור את הקבצים לפה או לחץ להעלאה.</p> :
                                                    <p>קבצים מוכנים להעלאה : {this.state.filesToUpload.length}</p> 
                                                }
                                            </Dropzone>
                                        }
                                        
                                        <span className='select-link-type'>( הצג כ: { <span onClick={() => this.setState({isPictureLink : false})} className={!this.state.isPictureLink ? 'link-selected' : ''}>קובץ</span>} | 
                                        { <span onClick={() => this.setState({isPictureLink : true})} className={this.state.isPictureLink ? 'link-selected' : ''}> תמונה</span>} )</span>
                                </span>
                                <span className='form-group'>
                                    <label>מספר טלפון</label>
                                    <input type='text' name='phoneNumber' value={this.state.phoneNumber} 
                                            onChange={(e) => this.setState({phoneNumber: e.target.value})}/>
                                </span>
                                <span className='form-group'>
                                    <label>דואר אלקטרוני</label>
                                    <input type='email' name='email' value={this.state.email} 
                                        onChange={(e) => this.setState({email: e.target.value})}/>
                                </span>
                            </div>
                            <div className='form-footer'>
                                <button type='submit' className={this.isFormValid() ? '' : 'disabled'}>שלח</button>
                            </div>
                        </form>
                    </div>
                }
            </span>
         )
    }
}
 
export default AddProduct;