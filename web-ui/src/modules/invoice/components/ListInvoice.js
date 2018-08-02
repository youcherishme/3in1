import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getInvoicesByAttacher, deleteInvoice } from '../actions/invoiceActions';

import Spinner from '../../common/components/controls/Spinner';
import { formatDate, getModuleName } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      timeout: null,
    }
    this.onChange = this.onChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }
  componentDidMount() {
    console.log('ListTask componentDidMount');

    var attacherid;
    var attacherType;
    if (this.props.attacherType === undefined) {
      attacherid = 0;
      attacherType = require('../../common/constants').MODULE_ALL;
    }
    else {
      attacherid = this.props.attacherid;
      attacherType = this.props.attacherType;
    }
    this.doSearch();
  }
  doSearch() {
    console.log('doSearch');
    var attacherid;
    var attacherType;
    if (this.props.attacherType === undefined) {
      attacherid = 0;
      attacherType = require('../../common/constants').MODULE_ALL;
    }
    else {
      attacherid = this.props.attacherid;
      attacherType = this.props.attacherType;
    }
    this.props.getInvoicesByAttacher(attacherid, attacherType, this.state.searchTerm,  this.props.user.email);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  onDeleteClick(id) {
    const userEmail = this.props.user.email;
    this.props.deleteInvoice(id, userEmail);
  }

  render() {
    const { loading } = this.props;
    var attacherid;
    var attacherTag;
    var attacherType;
    if (this.props.attacherType === undefined) {
      attacherid = 0;
      attacherTag = '0';
      attacherType = require('../../common/constants').MODULE_ALL;
    }
    else {
      attacherid = this.props.attacherid;
      attacherTag = this.props.attacherTag;
      attacherType = this.props.attacherType;
    }

    var invoiceContent = <tr><td></td></tr>;
    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.invoices) {
        invoiceContent = this.props.invoices.map(invoice => {
          var linkTo = '';
          linkTo = '/' + getModuleName(invoice.attacherType) + '/' + invoice.attacherid;
          return (
            <tr key={invoice._id}>
              <td><Link to={`/invoice/${invoice._id}`}>{invoice.invoiceNo}</Link></td>
              <td>{formatDate(invoice.invoiceDate, '/')}</td>
              <td>{formatDate(invoice.dueDate, '/')}</td>
              <td>{invoice.balanceDue}</td>
              <td><Link to={`/client/${invoice.client}`}>{invoice.clientName}</Link></td>
              <td><Link to={`/case/${invoice.user}`}>{invoice.userName}</Link></td>
              {attacherType != require('../../common/constants').MODULE_ALL ?'':<td><Link to={linkTo}>{invoice.attacherType != 0 ? invoice.attacherTag : ''}</Link></td>}
              <td>
              <button
                  onClick={this.onDeleteClick.bind(this, invoice._id)}
                  className="btn-light">
                  <i className="fas fa-minus-circle text-info mr-1" />
                  Delete
              </button>
              </td>
            </tr>
          );
        });
      }
    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="mb-4">Invoices</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-invoice/${attacherid}/${attacherTag}/${attacherType}`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Invoice
            </Link>
            </div>
            <div className="col">
              <TextFieldGroup
                placeholder="Search..."
                value={this.state.searchTerm}
                onChange={this.onChange}
                name="searchTerm"
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                    <th>Due Date</th>
                    <th>Balance Due</th>
                    <th>Client</th>
                    <th>User</th>
                    {attacherType != require('../../common/constants').MODULE_ALL ? '' : <th>Link to</th>}
                  </tr>
                </thead>
                <tbody>
                  {invoiceContent}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {loadingContent}
            </div>
          </div>

        </div>
      </div>

    );
  }
}

ListInvoice.propTypes = {
  deleteInvoice: PropTypes.func.isRequired,
  //invoices: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    invoices: state.invoice.invoices ? state.invoice.invoices : null,
    loading: state.invoice.loading,
  };
};

export default connect(mapStateToProps, { getInvoicesByAttacher, deleteInvoice })(
  ListInvoice
);
