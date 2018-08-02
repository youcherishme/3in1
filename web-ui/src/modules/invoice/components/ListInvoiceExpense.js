import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addInvoice, getInvoice } from '../actions/invoiceActions';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import _ from "lodash";
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';

import mongoose from 'mongoose';

class ListInvoiceExpense extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onAddInvoiceExpenseClick = this.onAddInvoiceExpenseClick.bind(this);
    this.onDeleteInvoiceExpenseClick = this.onDeleteInvoiceExpenseClick.bind(this);
    this.onSaveInvoiceExpensesClick = this.onSaveInvoiceExpensesClick.bind(this);
  }
  componentDidMount() {
    console.log('ListInvoiceExpense componentDidMount');
    const invoiceid = this.props.invoiceid;
    const userEmail = this.props.user.email;
    this.props.getInvoice(invoiceid, userEmail);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    const { loading, invoice } = this.props;
    const { name, value } = e.target;

    const invoiceExpenseField = name.split('_')[0];
    const invoiceExpenseId = name.split('_')[1];

    const invoiceExpenseIndex = _.findIndex(invoice.invoiceExpenses, function (invoiceExpense) {
      return invoiceExpense._id == invoiceExpenseId;
    });
    const path = 'invoiceExpenses[' + invoiceExpenseIndex + '].' + invoiceExpenseField;
    _.set(invoice, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }

  onAddInvoiceExpenseClick(e) {
    debugger
    const { loading, invoice } = this.props;
    if (invoice && invoice.invoiceExpenses) {
      var invoiceExpense = {
        _id: mongoose.Types.ObjectId().toString(),
        content: '',
        expenseDate: formatDate(new Date(), '-', 'ymd'),
        quantity: 1,
      };
      invoice.invoiceExpenses.push(invoiceExpense);

      this.forceUpdate();
    }
  }
  onDeleteInvoiceExpenseClick(invoiceExpenseId) {
    const { loading, invoice } = this.props;
    if (invoice && invoice.invoiceExpenses && invoice.invoiceExpenses) {
      const invoiceExpenseIndex = _.findIndex(invoice.invoiceExpenses, function (invoiceExpense) {
        return invoiceExpense._id == invoiceExpenseId;
      });
      invoice.invoiceExpenses.splice(invoiceExpenseIndex, 1);

      this.forceUpdate();
    }
  }
  onSaveInvoiceExpensesClick(e) {
    e.preventDefault();
    const { loading, invoice } = this.props;

    this.props.addInvoice(invoice, () => {
    });
  }
  render() {
    const { loading, invoice } = this.props;
    var invoiceExpenseRowContent;
    var invoiceExpenseRowTotal = 0;

    if (loading) {
      invoiceExpenseRowContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (invoice && invoice.invoiceExpenses ) {
        invoiceExpenseRowContent = invoice.invoiceExpenses.map(invoiceExpense => {
          invoiceExpense.total = invoiceExpense.price * invoiceExpense.quantity;
          invoiceExpenseRowTotal += invoiceExpense.total;
          return (
            <tr key={invoiceExpense._id}>
              <td>
                <TextFieldGroup
                  type='date'
                  placeholder="Date"
                  name={'expenseDate_' + invoiceExpense._id}
                  value={formatDate(invoiceExpense.expenseDate, '-', 'ymd')}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  placeholder="Content"
                  name={'content_' + invoiceExpense._id}
                  value={invoiceExpense.content}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  placeholder="Price"
                  name={'price_' + invoiceExpense._id}
                  value={invoiceExpense.price}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  placeholder="Quantity"
                  name={'quantity_' + invoiceExpense._id}
                  value={invoiceExpense.quantity}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  disabled='true'
                  placeholder="Total"
                  name={'total_' + invoiceExpense._id}
                  value={invoiceExpense.total}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
              <button
                  onClick={this.onDeleteInvoiceExpenseClick.bind(this, invoiceExpense._id)}
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
        <h1 className="mb-4">Expenses</h1>
        <button type="button" className="btn btn-info"
          onClick={this.onAddInvoiceExpenseClick.bind(this)} >
          Add Expense
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Content</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceExpenseRowContent}
            <tr>
              <td>
                Total Expense
              </td>
              <td>
                {invoiceExpenseRowTotal}
              </td>
            </tr>
          </tbody>
        </table>
        <input
          type="submit"
          value="Save Expenses"
          onClick={this.onSaveInvoiceExpensesClick}
          className="btn btn-info btn-block mt-4"
        />

      </div>

    );
  }
}

ListInvoiceExpense.propTypes = {
  //deleteInvoiceExpense: PropTypes.func.isRequired,
  //invoiceExpenses: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    invoice: state.invoice.invoice,
    loading: state.invoice.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getInvoice, addInvoice })(
  ListInvoiceExpense
);
