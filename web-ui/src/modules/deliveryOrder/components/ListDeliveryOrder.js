import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDeliveryOrdersByAttacher, deleteDeliveryOrder } from '../actions/deliveryOrderActions';
import Spinner from '../../common/components/controls/Spinner';
import { formatDate, getModuleName } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListDeliveryOrder extends Component {
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
    this.props.getDeliveryOrdersByAttacher(attacherid, attacherType, this.state.searchTerm, this.props.user.email);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  onDeleteClick(id) {
    this.props.deleteDeliveryOrder(id);
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

    var deliveryOrderContent = <tr><td></td></tr>;
    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.deliveryOrders) {
        deliveryOrderContent = this.props.deliveryOrders.map(deliveryOrder => {
          var linkTo = '';
          linkTo = '/' + getModuleName(deliveryOrder.attacherType) + '/' + deliveryOrder.attacherid;
          return (
            <tr key={deliveryOrder._id}>
              <td><Link to={`/deliveryOrder/${deliveryOrder._id}`}>{deliveryOrder.deliveryOrderNo}</Link></td>
              <td>{formatDate(deliveryOrder.deliveryOrderDate, '/')}</td>
              <td>{formatDate(deliveryOrder.dueDate, '/')}</td>
              <td><Link to={`/client/${deliveryOrder.client}`}>{deliveryOrder.clientName}</Link></td>
              <td><Link to={`/case/${deliveryOrder.user}`}>{deliveryOrder.userName}</Link></td>
              {attacherType != require('../../common/constants').MODULE_ALL ? '' : <td><Link to={linkTo}> {deliveryOrder.attacherType != 0 ? deliveryOrder.attacherTag : ''}</Link></td>}
              <td>
                <button
                  onClick={this.onDeleteClick.bind(this, deliveryOrder._id)}
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
              <h1 className="mb-4">Delivery Orders</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-deliveryOrder/${attacherid}/${attacherTag}/${attacherType}`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Delivery Order
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
                    <th>Delivery Order No</th>
                    <th>Delivery Order Date</th>
                    <th>Due Date</th>
                    <th>Client</th>
                    <th>User</th>
                    {attacherType != require('../../common/constants').MODULE_ALL ? '' : <th>Link to</th>}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {deliveryOrderContent}
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

ListDeliveryOrder.propTypes = {
  deleteDeliveryOrder: PropTypes.func.isRequired,
  //deliveryOrders: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    deliveryOrders: state.deliveryOrder.deliveryOrders ? state.deliveryOrder.deliveryOrders : null,
    loading: state.deliveryOrder.loading,
  };
};

export default connect(mapStateToProps, { getDeliveryOrdersByAttacher, deleteDeliveryOrder })(
  ListDeliveryOrder
);
