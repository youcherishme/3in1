import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addDeliveryOrder, getDeliveryOrder } from '../actions/deliveryOrderActions';
import Spinner from '../../common/components/controls/Spinner';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import InputGroup from '../../common/components/controls/InputGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import { getStaffs } from '../../staff/actions/staffActions';
import _ from "lodash";
import mongoose from 'mongoose';
import { formatDate } from '../../common/utils/General';

class ListDeliveryOrderItem extends Component {
  componentDidMount() {
    console.log('ListDeliveryOrderItem componentDidMount');
    const deliveryOrderid = this.props.deliveryOrderid;
    this.props.getDeliveryOrder(deliveryOrderid);

    this.staffOptions = [];

    this.props.getStaffs();

    this.onChange = this.onChange.bind(this);
    this.onAddDeliveryOrderItemClick = this.onAddDeliveryOrderItemClick.bind(this);
    this.onDeleteDeliveryOrderItemClick = this.onDeleteDeliveryOrderItemClick.bind(this);
    this.onSaveDeliveryOrderItemsClick = this.onSaveDeliveryOrderItemsClick.bind(this);
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
    const { loading, deliveryOrder } = this.props;
    const { name, value } = e.target;

    const deliveryOrderItemField = name.split('_')[0];
    const deliveryOrderItemId = name.split('_')[1];

    const deliveryOrderItemIndex = _.findIndex(deliveryOrder.deliveryOrderItems, function (deliveryOrderItem) {
      return deliveryOrderItem._id == deliveryOrderItemId;
    });
    const path = 'deliveryOrderItems[' + deliveryOrderItemIndex + '].' + deliveryOrderItemField;
    _.set(deliveryOrder, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }
  onStaffSelectChange(e) {
    const { loading, deliveryOrder } = this.props;
    const { name, value } = e.target;

    const deliveryOrderItemField = name.split('_')[0];
    const deliveryOrderItemId = name.split('_')[1];

    const deliveryOrderItemIndex = _.findIndex(deliveryOrder.deliveryOrderItems, function (deliveryOrderItem) {
      return deliveryOrderItem._id == deliveryOrderItemId;
    });
    const path = 'deliveryOrderItems[' + deliveryOrderItemIndex + '].' + deliveryOrderItemField;
    _.set(deliveryOrder, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }

  onAddDeliveryOrderItemClick(e) {
    const { loading, deliveryOrder } = this.props;
    if (deliveryOrder && deliveryOrder.deliveryOrderItems) {
      var deliveryOrderItem = {
        _id: mongoose.Types.ObjectId().toString(),
        content: '',
        quantity: 1,
      };
      deliveryOrder.deliveryOrderItems.push(deliveryOrderItem);

      this.forceUpdate();
    }
  }
  onDeleteDeliveryOrderItemClick(deliveryOrderItemId) {
    const { loading, deliveryOrder } = this.props;
    if (deliveryOrder && deliveryOrder.deliveryOrderItems && deliveryOrder.deliveryOrderItems) {
      const deliveryOrderItemIndex = _.findIndex(deliveryOrder.deliveryOrderItems, function (deliveryOrderItem) {
        return deliveryOrderItem._id == deliveryOrderItemId;
      });
      deliveryOrder.deliveryOrderItems.splice(deliveryOrderItemIndex, 1);

      this.forceUpdate();
    }
  }
  onSaveDeliveryOrderItemsClick(e) {
    e.preventDefault();
    const { loading, deliveryOrder } = this.props;

    this.props.addDeliveryOrder(deliveryOrder, () => {
    });
  }
  render() {
    const { loading, deliveryOrder } = this.props;
    var deliveryOrderItemRowContent;
    var deliveryOrderItemRowTotal = 0;

    if (loading) {
      deliveryOrderItemRowContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (deliveryOrder && deliveryOrder.deliveryOrderItems && this.staffOptions) {
        deliveryOrderItemRowContent = deliveryOrder.deliveryOrderItems.map(deliveryOrderItem => {
          deliveryOrderItem.total = deliveryOrderItem.price * deliveryOrderItem.quantity;
          deliveryOrderItemRowTotal += deliveryOrderItem.total;
          return (
            <tr key={deliveryOrderItem._id}>
              <td>
                <TextFieldGroup
                  placeholder="Content"
                  name={'content_' + deliveryOrderItem._id}
                  value={deliveryOrderItem.content}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  placeholder="Price"
                  name={'price_' + deliveryOrderItem._id}
                  value={deliveryOrderItem.price}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  type='number'
                  placeholder="Quantity"
                  name={'quantity_' + deliveryOrderItem._id}
                  value={deliveryOrderItem.quantity}
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
                  name={'total_' + deliveryOrderItem._id}
                  value={deliveryOrderItem.total}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <button
                  onClick={this.onDeleteDeliveryOrderItemClick.bind(this, deliveryOrderItem._id)}
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
          onClick={this.onAddDeliveryOrderItemClick.bind(this)} >
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
            {deliveryOrderItemRowContent}
            <tr>
              <td>
                Total Item
              </td>
              <td>
                {deliveryOrderItemRowTotal}
              </td>
            </tr>
          </tbody>
        </table>
        <input
          type="submit"
          value="Save Items"
          onClick={this.onSaveDeliveryOrderItemsClick}
          className="btn btn-info btn-block mt-4"
        />

      </div>

    );
  }
}

ListDeliveryOrderItem.propTypes = {
  //deleteDeliveryOrderItem: PropTypes.func.isRequired,
  //deliveryOrderItems: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    deliveryOrder: state.deliveryOrder.deliveryOrder,
    loading: state.deliveryOrder.loading,
    staffs: state.staff.staffs,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getDeliveryOrder, addDeliveryOrder, getStaffs })(
  ListDeliveryOrderItem
);
