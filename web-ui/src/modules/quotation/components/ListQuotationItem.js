import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addQuotation, getQuotation } from '../actions/quotationActions';
import Spinner from '../../common/components/controls/Spinner';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import InputGroup from '../../common/components/controls/InputGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import { getStaffs } from '../../staff/actions/staffActions';
import _ from "lodash";
import mongoose from 'mongoose';
import { formatDate } from '../../common/utils/General';

class ListQuotationItem extends Component {
  componentDidMount() {
    console.log('ListQuotationItem componentDidMount');
    const quotationid = this.props.quotationid;
    this.props.getQuotation(quotationid);

    this.staffOptions = [];

    this.props.getStaffs();

    this.onChange = this.onChange.bind(this);
    this.onAddQuotationItemClick = this.onAddQuotationItemClick.bind(this);
    this.onDeleteQuotationItemClick = this.onDeleteQuotationItemClick.bind(this);
    this.onSaveQuotationItemsClick = this.onSaveQuotationItemsClick.bind(this);
    this.onStaffSelectChange = this.onStaffSelectChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.staffs) {
      const originalStaffs = nextProps.staffs;
      var staffOptions = _.map(originalStaffs, function (staffOption) {
        return {
          value: staffOption._id,
          label: staffOption.firstName + ' ' + staffOption.lastName,
        }
      });
      this.staffOptions = staffOptions;
    }
  }
  onChange(e) {
    const { loading, quotation } = this.props;
    const { name, value } = e.target;

    const quotationItemField = name.split('_')[0];
    const quotationItemId = name.split('_')[1];

    const quotationItemIndex = _.findIndex(quotation.quotationItems, function (quotationItem) {
      return quotationItem._id == quotationItemId;
    });
    const path = 'quotationItems[' + quotationItemIndex + '].' + quotationItemField;
    _.set(quotation, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }
  onStaffSelectChange(e) {
    const { loading, quotation } = this.props;
    const { name, value } = e.target;

    const quotationItemField = name.split('_')[0];
    const quotationItemId = name.split('_')[1];

    const quotationItemIndex = _.findIndex(quotation.quotationItems, function (quotationItem) {
      return quotationItem._id == quotationItemId;
    });
    const path = 'quotationItems[' + quotationItemIndex + '].' + quotationItemField;
    _.set(quotation, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }

  onAddQuotationItemClick(e) {
    const { loading, quotation } = this.props;
    if (quotation && quotation.quotationItems) {
      var quotationItem = {
        _id: mongoose.Types.ObjectId().toString(),
        content: '',
        quantity: 1,
      };
      quotation.quotationItems.push(quotationItem);

      this.forceUpdate();
    }
  }
  onDeleteQuotationItemClick(quotationItemId) {
    const { loading, quotation } = this.props;
    if (quotation && quotation.quotationItems && quotation.quotationItems) {
      const quotationItemIndex = _.findIndex(quotation.quotationItems, function (quotationItem) {
        return quotationItem._id == quotationItemId;
      });
      quotation.quotationItems.splice(quotationItemIndex, 1);

      this.forceUpdate();
    }
  }
  onSaveQuotationItemsClick(e) {
    e.preventDefault();
    const { loading, quotation } = this.props;

    this.props.addQuotation(quotation, () => {
    });
  }
  render() {
    const { loading, quotation } = this.props;
    var quotationItemRowContent;
    var quotationItemRowTotal = 0;

    if (loading) {
      quotationItemRowContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (quotation && quotation.quotationItems && this.staffOptions) {
        quotationItemRowContent = quotation.quotationItems.map(quotationItem => {
          quotationItem.total = quotationItem.price * quotationItem.quantity;
          quotationItemRowTotal += quotationItem.total;
          return (
            <tr key={quotationItem._id}>
              <td>
                <TextFieldGroup
                  placeholder="Content"
                  name={'content_' + quotationItem._id}
                  value={quotationItem.content}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  placeholder="Price"
                  name={'price_' + quotationItem._id}
                  value={quotationItem.price}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  placeholder="Quantity"
                  name={'quantity_' + quotationItem._id}
                  value={quotationItem.quantity}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  disabled='true'
                  placeholder="Total"
                  name={'total_' + quotationItem._id}
                  value={quotationItem.total}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <button
                  onClick={this.onDeleteQuotationItemClick.bind(this, quotationItem._id)}
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
        <h1 className="mb-4">Items</h1>
        <button type="button" className="btn btn-info"
          onClick={this.onAddQuotationItemClick.bind(this)} >
          Add Item
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {quotationItemRowContent}
            <tr>
              <td>
                Total Item
              </td>
              <td>
                {quotationItemRowTotal}
              </td>
            </tr>
          </tbody>
        </table>
        <input
          type="submit"
          value="Save Items"
          onClick={this.onSaveQuotationItemsClick}
          className="btn btn-info btn-block mt-4"
        />

      </div>

    );
  }
}

ListQuotationItem.propTypes = {
  //deleteQuotationItem: PropTypes.func.isRequired,
  //quotationItems: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    quotation: state.quotation.quotation,
    loading: state.quotation.loading,
    staffs: state.staff.staffs,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getQuotation, addQuotation, getStaffs })(
  ListQuotationItem
);
