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

class ListInvoiceAdjustment extends Component {
  componentDidMount() {
    console.log('ListInvoiceAdjustment componentDidMount');
    const invoiceid = this.props.invoiceid;
    this.props.getInvoice(invoiceid);

    this.onChange = this.onChange.bind(this);
    this.onAddInvoiceAdjustmentClick = this.onAddInvoiceAdjustmentClick.bind(this);
    this.onDeleteInvoiceAdjustmentClick = this.onDeleteInvoiceAdjustmentClick.bind(this);
    this.onSaveInvoiceAdjustmentsClick = this.onSaveInvoiceAdjustmentsClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    const { loading, invoice } = this.props;
    const { name, value } = e.target;

    const invoiceAdjustmentField = name.split('_')[0];
    const invoiceAdjustmentId = name.split('_')[1];

    const invoiceAdjustmentIndex = _.findIndex(invoice.invoiceAdjustments, function (invoiceAdjustment) {
      return invoiceAdjustment._id == invoiceAdjustmentId;
    });
    const path = 'invoiceAdjustments[' + invoiceAdjustmentIndex + '].' + invoiceAdjustmentField;
    _.set(invoice, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }
  onAddInvoiceAdjustmentClick(e) {
    const { loading, invoice } = this.props;
    if (invoice && invoice.invoiceAdjustments) {
      var invoiceAdjustment = {
        _id: mongoose.Types.ObjectId().toString(),
        content: '',
        adjustmentDate: formatDate(new Date(), '-', 'ymd'),
      };
      invoice.invoiceAdjustments.push(invoiceAdjustment);

      this.forceUpdate();
    }
  }
  onDeleteInvoiceAdjustmentClick(invoiceAdjustmentId) {
    const { loading, invoice } = this.props;
    if (invoice && invoice.invoiceAdjustments && invoice.invoiceAdjustments) {
      const invoiceAdjustmentIndex = _.findIndex(invoice.invoiceAdjustments, function (invoiceAdjustment) {
        return invoiceAdjustment._id == invoiceAdjustmentId;
      });
      invoice.invoiceAdjustments.splice(invoiceAdjustmentIndex, 1);

      this.forceUpdate();
    }
  }
  onSaveInvoiceAdjustmentsClick(e) {
    e.preventDefault();
    const { loading, invoice } = this.props;

    this.props.addInvoice(invoice, () => {
      //this.props.history.push('/invoice');
    });
  }
  render() {
    const { loading, invoice } = this.props;

    var invoiceAdjustmentRowContent;
    var invoiceAdjustmentRowTotal = 0;

    if (loading) {
      invoiceAdjustmentRowContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (invoice && invoice.invoiceAdjustments) {
        invoiceAdjustmentRowContent = invoice.invoiceAdjustments.map(invoiceAdjustment => {
          invoiceAdjustment.total = invoiceAdjustment.amount;
          invoiceAdjustmentRowTotal += parseFloat(invoiceAdjustment.total);
          return (
            <tr key={invoiceAdjustment._id}>
              <td>
                <TextFieldGroup
                  type='date'
                  placeholder="Date"
                  name={'adjustmentDate_' + invoiceAdjustment._id}
                  value={formatDate(invoiceAdjustment.adjustmentDate, '-', 'ymd')}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>

              <td>
                <TextFieldGroup
                  placeholder="Content"
                  name={'content_' + invoiceAdjustment._id}
                  value={invoiceAdjustment.content}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  placeholder="Amount"
                  name={'amount_' + invoiceAdjustment._id}
                  value={invoiceAdjustment.amount}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
              <button
                  onClick={this.onDeleteInvoiceAdjustmentClick.bind(this, invoiceAdjustment._id)}
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
        <h1 className="mb-4">Adjustments</h1>
        <button type="button" className="btn btn-info"
          onClick={this.onAddInvoiceAdjustmentClick.bind(this)} >
          Add Adjustment
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Content</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceAdjustmentRowContent}
            <tr>
              <td>
                Total Adjustment
              </td>
              <td>
                {invoiceAdjustmentRowTotal}
              </td>
            </tr>
          </tbody>
        </table>
        <input
          type="submit"
          value="Save Adjustments"
          onClick={this.onSaveInvoiceAdjustmentsClick}
          className="btn btn-info btn-block mt-4"
        />

      </div>

    );
  }
}

ListInvoiceAdjustment.propTypes = {
  //deleteInvoiceAdjustment: PropTypes.func.isRequired,
  //invoiceAdjustments: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    invoice: state.invoice.invoice,
    loading: state.invoice.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getInvoice, addInvoice })(
  ListInvoiceAdjustment
);
