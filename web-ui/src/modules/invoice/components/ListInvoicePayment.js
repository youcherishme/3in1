import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { addInvoice, getInvoice } from '../actions/invoiceActions';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import _ from "lodash";
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';

import mongoose from 'mongoose';

class ListInvoicePayment extends Component {
  componentDidMount() {
    console.log('ListInvoicePayment componentDidMount');
    const invoiceid = this.props.invoiceid;
    this.props.getInvoice(invoiceid);

    this.onChange = this.onChange.bind(this);
    this.onAddInvoicePaymentClick = this.onAddInvoicePaymentClick.bind(this);
    this.onDeleteInvoicePaymentClick = this.onDeleteInvoicePaymentClick.bind(this);
    this.onSaveInvoicePaymentsClick = this.onSaveInvoicePaymentsClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    const { loading, invoice } = this.props;
    const { name, value } = e.target;

    const invoicePaymentField = name.split('_')[0];
    const invoicePaymentId = name.split('_')[1];

    const invoicePaymentIndex = _.findIndex(invoice.invoicePayments, function (invoicePayment) {
      return invoicePayment._id == invoicePaymentId;
    });
    const path = 'invoicePayments[' + invoicePaymentIndex + '].' + invoicePaymentField;
    _.set(invoice, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }

  onAddInvoicePaymentClick(e) {
    const { loading, invoice } = this.props;
    if (invoice && invoice.invoicePayments) {
      var invoicePayment = {
        _id: mongoose.Types.ObjectId().toString(),
        content: '',
        paymentDate: formatDate(new Date(), '-', 'ymd'),
        amount: 0,
      };
      invoice.invoicePayments.push(invoicePayment);

      this.forceUpdate();
    }
  }
  onDeleteInvoicePaymentClick(invoicePaymentId) {
    const { loading, invoice } = this.props;
    if (invoice && invoice.invoicePayments && invoice.invoicePayments) {
      const invoicePaymentIndex = _.findIndex(invoice.invoicePayments, function (invoicePayment) {
        return invoicePayment._id == invoicePaymentId;
      });
      invoice.invoicePayments.splice(invoicePaymentIndex, 1);

      this.forceUpdate();
    }
  }
  onSaveInvoicePaymentsClick(e) {
    e.preventDefault();
    const { loading, invoice } = this.props;

    this.props.addInvoice(invoice, () => {
      //this.props.history.push('/invoice');
    });
  }
  render() {
    const { loading, invoice } = this.props;

    var invoicePaymentContent;
    var invoicePaymentRowTotal = 0;

    if (loading) {
      invoicePaymentContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (invoice && invoice.invoicePayments) {
        invoicePaymentContent = invoice.invoicePayments.map(invoicePayment => {
          invoicePaymentRowTotal += parseFloat(invoicePayment.amount);
          return (
            <tr key={invoicePayment._id}>
              <td>
                <TextFieldGroup
                  type='date'
                  placeholder="Date"
                  name={'paymentDate_' + invoicePayment._id}
                  value={formatDate(invoicePayment.paymentDate, '-', 'ymd')}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  placeholder="Content"
                  name={'content_' + invoicePayment._id}
                  value={invoicePayment.content}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  placeholder="Paymenet Method"
                  name={'paymentMethod_' + invoicePayment._id}
                  value={invoicePayment.paymentMethod}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  placeholder="Paymenet Method Note"
                  name={'paymentMethodNote_' + invoicePayment._id}
                  value={invoicePayment.paymentMethodNote}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  placeholder="Amount"
                  name={'amount_' + invoicePayment._id}
                  value={invoicePayment.amount}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
              <button
                  onClick={this.onDeleteInvoicePaymentClick.bind(this, invoicePayment._id)}
                  className="btn-light">
                  <i className="fas fa-minus-circle text-info mr-1" />
                  Delete
              </button>
              </td>
            </tr>
          )
        }
        );
      }

    }
    return (
      <div>
        <h1 className="mb-4">Payments</h1>
        <button type="button" className="btn btn-info"
          onClick={this.onAddInvoicePaymentClick.bind(this)} >
          Add Payment
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Content</th>
              <th>Payment Method</th>
              <th>Payment Method Note</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoicePaymentContent}
            <tr>
              <td>
                Total Payment
              </td>
              <td>
                {invoicePaymentRowTotal}
              </td>
            </tr>
          </tbody>
        </table>
        <input
          type="submit"
          value="Save Payments"
          onClick={this.onSaveInvoicePaymentsClick}
          className="btn btn-info btn-block mt-4"
        />

      </div>

    );
  }
}

ListInvoicePayment.propTypes = {
  //deleteInvoicePayment: PropTypes.func.isRequired,
  //invoicePayments: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    invoice: state.invoice.invoice,
    loading: state.invoice.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getInvoice, addInvoice })(
  ListInvoicePayment
);
