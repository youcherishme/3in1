import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import InputGroup from '../../common/components/controls/InputGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import { addDeliveryOrder, getDeliveryOrder } from '../actions/deliveryOrderActions';
import { getClients } from '../../client/actions/clientActions';
import { resetStore  } from '../../common/actions/commonActions';

import ListDeliveryOrderItem from './ListDeliveryOrderItem';

import _ from "lodash";
import { formatDate } from '../../common/utils/General';
import isEmpty from '../../common/validation/is-empty';
import ListComment from '../../comment/components/ListComment';
import ListTask from '../../task/components/ListTask';

class EditDeliveryOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deliveryOrderNo: '',
      deliveryOrderDate: '',
      description: '',
      dueDate: '',
      termsConditions: '',

      clientName: '',
      clientid: '0',

      userName: '',
      userid: 0,
      userEmail: '',

      errors: {},

    };
    this.clientOptions = [];

    this.onClientSelectChange = this.onClientSelectChange.bind(this);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const userEmail = this.props.user.email;
    this.props.getDeliveryOrder(id, userEmail);
    this.props.getClients('*',  this.props.user.email);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.deliveryOrder) {
      const deliveryOrder = nextProps.deliveryOrder;
      this.setState({
        _id: deliveryOrder._id,
        deliveryOrderNo: deliveryOrder.deliveryOrderNo,
        deliveryOrderDate: deliveryOrder.deliveryOrderDate,
        description: deliveryOrder.description,
        dueDate: deliveryOrder.dueDate,
        termsConditions: deliveryOrder.termsConditions,

        clientid: deliveryOrder.client,
        clientName: deliveryOrder.clientName,

        userid: deliveryOrder.userid,
        userName: deliveryOrder.userName,
        userEmail: deliveryOrder.userEmail,
        });
    }

    if (nextProps.clients) {
      const originalClients = nextProps.clients;
      var clientOptions = _.map(originalClients, function (client) {
        return {
          value: client._id,
          label: client.name,
        }
      });
      this.clientOptions = clientOptions;
    }
  }

  onSubmit(e) {
    e.preventDefault();
    var clientOption = _.find(this.clientOptions, { value: this.state.clientid });

    const deliveryOrderData = {
      _id: this.state._id,
      deliveryOrderNo: this.state.deliveryOrderNo,
      deliveryOrderDate: this.state.deliveryOrderDate,
      description: this.state.description,
      dueDate: this.state.dueDate,
      termsConditions: this.state.termsConditions,

      clientid: this.state.clientid,
      clientName: this.state.clientName,

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,            
    };

    this.props.addDeliveryOrder(deliveryOrderData, () => {
      this.goBack();
    });
  }

  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }
  
  onClientSelectChange(event) {
    this.setState(
      {
        clientid: event.target.value,
      });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const MODULE_TYPE = require('../../common/constants').MODULE_QUOTATION;

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Delivery Order</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <SelectListGroup
                  placeholder="* Select Client..."
                  name="client"
                  value={this.state.clientid}
                  onChange={this.onClientSelectChange}
                  options={this.clientOptions}
                  error={errors.client}
                  info="* Client"
                />

                <TextFieldGroup
                  placeholder="* Delivery Order No"
                  name="deliveryOrderNo"
                  value={this.state.deliveryOrderNo}
                  onChange={this.onChange}
                  error={errors.deliveryOrderNo}
                  info="* Delivery Order No"
                />
                <TextFieldGroup
                  type='date'
                  placeholder="* Delivery Order Date"
                  name="deliveryOrderDate"
                  value={formatDate(this.state.deliveryOrderDate, '-', 'ymd')}
                  onChange={this.onChange}
                  error={errors.deliveryOrderDate}
                  info="* Delivery Order Date"
                />
                <TextAreaFieldGroup
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="Description"
                />
                <TextAreaFieldGroup
                  placeholder="Terms & Conditions"
                  name="termsConditions"
                  value={this.state.termsConditions}
                  onChange={this.onChange}
                  error={errors.termsConditions}
                  info="Terms & Conditions"
                />

                <TextFieldGroup
                  type='date'
                  placeholder="Due Date"
                  name="dueDate"
                  value={formatDate(this.state.dueDate, '-', 'ymd')}
                  onChange={this.onChange}
                  error={errors.dueDate}
                  info="Due Date"
                />

                <input
                  type="submit"
                  value="Save"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr />
              <ListDeliveryOrderItem deliveryOrderid={`${this.props.match.params.id}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListTask attacherid= {`${this.props.match.params.id}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListComment attacherid= {`${this.props.match.params.id}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>

        </div>
      </div>
    );
  }
}

EditDeliveryOrder.propTypes = {
  getDeliveryOrder: PropTypes.func.isRequired,
  getClients: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    deliveryOrder: state.deliveryOrder.deliveryOrder,
    clients: state.client.clients,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getDeliveryOrder, addDeliveryOrder, getClients, resetStore })(
  withRouter(EditDeliveryOrder)
);
