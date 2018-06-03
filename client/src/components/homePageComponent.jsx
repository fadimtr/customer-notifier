import React , { Component } from 'react';
import { observer , inject } from 'mobx-react';
import ProductsGrid from './productsGridComponent'
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import AddProduct from './products/addProductComponent';
import ReactTooltip from 'react-tooltip';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
@inject('ProductsStore','RouteStore') @observer
class HomePage extends Component {
    state = {
        columns : [{
            dataField: 'productId',
            text: 'מספר מוצר',
            sort: true
          }, 
          {
            dataField: 'customer',
            text: 'לקוח',
            sort: true
          },
          {
            dataField: 'createdBy',
            text: 'אחראי',
            sort: true
          }, 
          {
            dataField: 'message',
            text: 'הודעה',
            formatter : (cell,row) => {
                return <span>
                            <span className='picture-icon-hover' data-tip data-for={`message-tooltip-${row.id}`}>
                                &#9998;
                            </span>
                            <ReactTooltip key={row.id} class='grid-product-picture-tooltip' id={`message-tooltip-${row.id}`} effect='solid'>
                                <div className='grid-tooltip-text'>{row.messageSubject}</div>
                                <div className='grid-tooltip-text'>{row.message}</div>
                            </ReactTooltip>
                        </span>
            }
          },
        //   {
        //     dataField: 'link',
        //     text: 'קישור',
        //     formatter : (cell,row) => {
        //         return row.link == '' ? '' :
        //                 row.file ? <a href={row.file}>קובץ</a> : 
        //                             <span>
        //                                 <span className='picture-icon-hover' data-tip data-for={`picture-tooltip-${row.id}`}>
        //                                     &#9863;
        //                                 </span>
        //                                 <ReactTooltip key={row.id} class='grid-product-picture-tooltip' id={`picture-tooltip-${row.id}`} effect='solid'>
        //                                     <img src={cell} className='product-picture-grid'/>
        //                                 </ReactTooltip>
        //                             </span>
        //     }
        //   },
          {
            dataField: 'phone',
            text: 'מספר טלפון',
            sort: true
          },
          {
            dataField: 'email',
            text: 'דואר אלקטרוני',
            sort: true
          },
          {
            dataField: 'email',
            text: 'פעולות',
            formatter : (cell,row) => {
                return row.isApproved || row.changeRequested ? <span>התקבל משוב</span> : <span>
                            <span className='grid-send-sms' title='Send SMS' onClick={() => this.setState({ showSMSAlert : true , selectedProduct : row })}>
                                {!row.phone || row.phone == '' ? <span className='disabled-sms'/> :  <i className="fa fa-mobile"></i>}
                            </span>
                            <span className='grid-send-email' title='Send Email' onClick={() => this.setState({ showEmailAlert: true , selectedProduct : row })}>
                                {!row.email || row.email == '' ? '' : <i className="fa fa-envelope"></i>}
                            </span>
                        </span>
            }
          }],
          productId:'',
          message:'',
          pictureLink:'',
          phoneNumber:'',
          email:''
    }

    sendSMS = () => {
        this.props.ProductsStore.sendSMS(this.state.selectedProduct);
    }

    sendEmail = () =>{
        this.props.ProductsStore.sendEmail(this.state.selectedProduct);
    }

    componentDidMount(){
        this.props.ProductsStore.getAll();
    }

    render() { 
        if(!this.props.ProductsStore.productsLoaded){
            return null;
        }

        return ( <div className='home-page-container'>
                    <ToastContainer position='bottom-right'/>
                    <div className='header'>
                        <ul className='header-left-list'>
                            {/* <li>مطبعة الطيرة  |   דפוס טירה</li> */}
                        </ul>
                        <ul className='header-right-list'>
                            <li onClick={this.props.RouteStore.logOut}>התנתק</li>
                        </ul>
                    </div>
                    <div className='home-page-content'>
                        <AddProduct/>
                        { this.props.RouteStore.loggedInUser.isAdmin ?
                            <div className='products-grid-container'>
                                <ProductsGrid data={ this.props.ProductsStore.products } columns={ this.state.columns } />
                            </div> : 
                            <div className='background-add-product'/>
                        }
                    </div>
                    <SweetAlert
                        show={this.state.showSMSAlert}
                        title="Send SMS To Customer"
                        text="Are you sure you want to send the customer an SMS ?"
                        showCancelButton
                        onConfirm={(data) => {this.sendSMS(data); this.setState({ showSMSAlert: false })}}
                        onCancel={() => this.setState({ showSMSAlert: false })}
                    />
                    <SweetAlert
                        show={this.state.showEmailAlert}
                        title="Send Email To Customer"
                        text="Are you sure you want to send the customer an Email ?"
                        showCancelButton
                        onConfirm={(data) => {this.sendEmail(data); this.setState({ showEmailAlert: false })}}
                        onCancel={() => this.setState({ showEmailAlert: false })}
                    />
                </div> )
    }
}
 
export default HomePage;