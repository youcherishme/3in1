import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import InputGroup from '../../common/components/controls/InputGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import { addQuotation, getQuotation } from '../actions/quotationActions';
import { getClients } from '../../client/actions/clientActions';
import { resetStore  } from '../../common/actions/commonActions';
import ListQuotationItem from './ListQuotationItem';

import _ from "lodash";
import { formatDate } from '../../common/utils/General';
import isEmpty from '../../common/validation/is-empty';
import ListComment from '../../comment/components/ListComment';
import ListTask from '../../task/components/ListTask';

class EditQuotation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quotationNo: '',
      quotationDate: '',
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
    this.props.getQuotation(id, userEmail);
    this.props.getClients('*',  this.props.user.email);    
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.quotation) {
      const quotation = nextProps.quotation;
      this.setState({
        _id: quotation._id,
        quotationNo: quotation.quotationNo,
        quotationDate: quotation.quotationDate,
        description: quotation.description,
        dueDate: quotation.dueDate,
        termsConditions: quotation.termsConditions,

        clientid: quotation.client,
        clientName: quotation.clientName,

        userid: quotation.userid,
        userName: quotation.userName,
        userEmail: quotation.userEmail,
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
    const quotationData = {
      _id: this.state._id,
      quotationNo: this.state.quotationNo,
      quotationDate: this.state.quotationDate,
      description: this.state.description,
      dueDate: this.state.dueDate,
      termsConditions: this.state.termsConditions,

      clientid: this.state.clientid,
      clientName: this.state.clientName,

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,            
    };

    this.props.addQuotation(quotationData, () => {
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
              <h1 className="display-4 text-center">Edit Quotation</h1>
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
                  placeholder="* Quotation No"
                  name="quotationNo"
                  value={this.state.quotationNo}
                  onChange={this.onChange}
                  error={errors.quotationNo}
                  info="* Quotation No"
                />
                <TextFieldGroup
                  type='date'
                  placeholder="* Quotation Date"
                  name="quotationDate"
                  value={formatDate(this.state.quotationDate, '-', 'ymd')}
                  onChange={this.onChange}
                  error={errors.quotationDate}
                  info="* Quotation Date"
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
              <ListQuotationItem quotationid={`${this.props.match.params.id}`} />
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

EditQuotation.propTypes = {
  getQuotation: PropTypes.func.isRequired,
  getClients: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    quotation: state.quotation.quotation,
    clients: state.client.clients,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getQuotation, addQuotation, getClients, resetStore })(
  withRouter(EditQuotation)
);
