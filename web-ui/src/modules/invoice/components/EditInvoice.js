import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import { addInvoice, getInvoice } from '../actions/invoiceActions';
import { getClients } from '../../client/actions/clientActions';
import { resetStore  } from '../../common/actions/commonActions';

import ListInvoiceExpense from './ListInvoiceExpense';
import ListInvoiceAdjustment from './ListInvoiceAdjustment';
import ListInvoicePayment from './ListInvoicePayment';
import ListComment from '../../comment/components/ListComment';

import _ from "lodash";
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';
import isEmpty from '../../common/validation/is-empty';

class EditInvoice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoiceNo: '',
      invoiceDate: '',
      description: '',
      dueDate: '',
      balanceDue: '',
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
    this.props.getInvoice(id, userEmail);
    this.props.getClients('*',  this.props.user.email);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.invoice) {
      const invoice = nextProps.invoice;
      this.setState({
        _id: invoice._id,
        invoiceNo: invoice.invoiceNo,
        invoiceDate: invoice.invoiceDate,
        description: invoice.description,
        dueDate: invoice.dueDate,
        balanceDue: invoice.balanceDue,
        termsConditions: invoice.termsConditions,

        clientid: invoice.client,
        clientName: invoice.clientName,

        userid: invoice.userid,
        userName: invoice.userName,
        userEmail: invoice.userEmail,
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
    var balanceDue = 0;

    const invoiceData = {
      _id: this.state._id,
      invoiceNo: this.state.invoiceNo,
      invoiceDate: this.state.invoiceDate,
      description: this.state.description,
      dueDate: this.state.dueDate,
      balanceDue: this.state.balanceDue,
      termsConditions: this.state.termsConditions,

      clientid: this.state.clientid,
      clientName: this.state.clientName,

      balanceDue: balanceDue,

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,      
    };

    this.props.addInvoice(invoiceData, () => {
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
    const MODULE_TYPE = require('../../common/constants').MODULE_INVOICE;

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Invoice</h1>
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
                  placeholder="* Invoice No"
                  name="invoiceNo"
                  value={this.state.invoiceNo}
                  onChange={this.onChange}
                  error={errors.invoiceNo}
                  info="* Invoice No"
                />
                <TextFieldGroup
                  type='date'
                  placeholder="* Invoice Date"
                  name="invoiceDate"
                  value={formatDate(this.state.invoiceDate, '-', 'ymd')}
                  onChange={this.onChange}
                  error={errors.invoiceDate}
                  info="* Invoice Date"
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
                <TextFieldGroup
                  placeholder="Balance Due"
                  name="balanceDue"
                  value={this.state.balanceDue}
                  onChange={this.onChange}
                  error={errors.balanceDue}
                  info="Balance Due"
                  disabled='true'
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
              <hr/>
              <ListInvoiceExpense invoiceid={`${this.props.match.params.id}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListInvoiceAdjustment invoiceid={`${this.props.match.params.id}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <ListInvoicePayment invoiceid={`${this.props.match.params.id}`} />
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

EditInvoice.propTypes = {
  getInvoice: PropTypes.func.isRequired,
  getClients: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    invoice: state.invoice.invoice,
    clients: state.client.clients,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getInvoice, addInvoice, getClients, resetStore })(
  withRouter(EditInvoice)
);
