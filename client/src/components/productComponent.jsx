import React from "react";
import Modal from 'react-responsive-modal';
import { observer , inject } from 'mobx-react';
import 'font-awesome/css/font-awesome.min.css';

@inject('ProductsStore') @observer
class Product extends React.Component{

    state = {
        message:'',
        modalOpen: false,
        approved:false,
        isChangeRequest: false
    };

    onOpenModal = () => {
        this.setState({ modalOpen: true });
    };
    
    onCloseModal = () => {
        this.setState({ modalOpen: false });
    };

    componentDidMount(){
        this.props.ProductsStore.getProduct(this.props.match.params.clientId);
    }

    approve = () => {
        this.props.ProductsStore.approveProduct(this.state.message);
        this.setState({
            approved:true
        });
    }

    changeRequest = () => {
        this.props.ProductsStore.changeProductRequest(this.state.message);
        this.setState({
            approved:true
        });
    }

    render(){
        let product = this.props.ProductsStore.requestedProduct;
        if(Object.keys(product).length == 0){
            return null;
        }

        let productApprovedMessage = product.approved || product.changeRequested ? 'המשוב שלך נשלח' : 'Thanks for reviewing the product.';
        return <div className='product-page-container'>
                    <div className='product-page-header'>
                        <span className='product-header-message'>{product.messageSubject}</span>
                        <span className='product-header-logo'>
                            <img src={require('../assets/images/logo.png')}/>
                        </span>
                    </div>
                    <div className='product-page-content'>
                        <div className='product-container'>
                            {   !product.files || product.files.length == 0 ? <span>לא מצורף קובץ</span> :
                                (product.attachmentType == 'picture' ? 
                                (<span><span className='image-align-helper'/>
                                        <img className='product-image' src={product.files[0].fileName}/></span>) :
                                product.files.length == 1 ? <span><span className='image-align-helper'/><a className='single-file-link' href={product.files[0].fileName} target='_blank'>קובץ להורדה</a></span> :
                                <ul className='files-list'>
                                    <li className='files-list-header'>רשימת קבצים מצורפים להודעה :</li>
                                    {
                                        product.files.map( (file,index) => <li className='files-list-item' key={index}><a href={file.fileName} target='_blank'>קובץ {index+1}</a></li>)
                                    }
                                </ul>)
                            }
                        </div>
                        <div className='product-comment'>
                        {
                            this.state.approved || product.approved || product.changeRequested ? 
                            <div className='product-comment-header'>
                                המשוב שלך נשלח בהצלחה.
                            </div> :
                            <span>
                                <div className='product-comment-header'>
                                    {product.message}
                                </div>
                                {this.state.isChangeRequest ? 
                                <div className='product-comment-input'>
                                    <textarea value={this.state.message} onChange={ (e) => this.setState({ message : e.target.value})}/>
                                    <span clsasName='product-comment-input-buttons'>
                                        <span className='product-button product-approve-button' onClick={this.changeRequest.bind(this)}>שלח</span>
                                        <span className='change-back-button' onClick={() => this.setState({isChangeRequest : false})}>חזור</span>
                                    </span>
                                </div> :
                                <div className='product-comment-buttons'>
                                    <span className='product-button product-approve-button' onClick={this.approve.bind(this)}>מאשר</span>
                                    <span className='product-button product-edit-button' onClick={() => this.setState({isChangeRequest : true})}>לא מאשר</span>
                                </div>}
                            </span>
                        }
                        </div>
                    </div>
                </div>
    }

};

export default Product;