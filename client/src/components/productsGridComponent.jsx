import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginator from 'react-bootstrap-table2-paginator';

class ProductsGrid extends React.Component{

    render(){
        return <BootstrapTable bordered={ false } keyField='id' data={ this.props.data } columns={ this.props.columns } pagination={ paginator() }/>
    }

};

export default ProductsGrid;