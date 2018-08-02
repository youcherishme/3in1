import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import { addQuotation } from '../actions/quotationActions';
import { getClients } from '../../client/actions/clientActions';
import { resetStore  } from '../../common/actions/commonActions';

import _ from "lodash";
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';

class AddQuotation extends Component {
  constructor(props) {
    super(props);

    const { attacherid, attacherTag, attacherType } = this.props.match.params;
    this.state = {
      clientName: '',
      clientid: '0',
      userName: '',
      userid: 0,
      userEmail: '',

      attacherid: attacherid,
      attacherTag: attacherTag,
      attacherType: attacherType,

      quotationNo: '',
      quotationDate: new Date(),
      description: '',
      dueDate: new Date(),
      termsConditions: '',

      createdDate: new Date(),

      errors: {},
      disabled: false
    };

    this.clientOptions = [];

    this.onClientSelectChange = this.onClientSelectChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    const userEmail = this.props.user.email;
    this.props.getClients('*',  this.props.user.email);        
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.clients) {
      const originalClients = nextProps.clients;
      var clientOptions = _.map(originalClients, function (clientOption) {
        return {
          value: clientOption._id,
          label: clientOption.name,
        }
      });
      this.clientOptions = clientOptions;

      //set default to first item
      this.setState(
        {
          clientid: this.clientOptions && this.clientOptions.length > 0 ? this.clientOptions[0].value : this.state.clientid,
        });
    }

    this.setState({
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,      
    })    
    
  }
  onClientSelectChange(event) {
    this.setState(
      {
        clientid: event.target.value,
      });
  }
  onSubmit(e) {
    e.preventDefault();

    var clientOption = _.find(this.clientOptions, { value: this.state.clientid });

    const quotationData = {
      quotationNo: this.state.quotationNo,
      quotationDate: this.state.quotationDate,
      description: this.state.description,
      dueDate: this.state.dueDate,
      termsConditions: this.state.termsConditions,

      attacherid: this.state.attacherid,
      attacherTag: this.state.attacherTag,
      attacherType: this.state.attacherType,

      clientid: this.state.clientid,
      clientName: this.state.clientName,

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,

      createdDate: this.state.createdDate,
    };
    this.props.addQuotation(quotationData, () => {
      this.goBack();
    });
  }
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }
  

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, loading } = this.props;

    if (loading) {
      return (
        <div><Spinner /></div>
      );
    }
    else {
      return (
        <div className="add-experience">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
                <h1 className="display-4 text-center">Add Quotation</h1>
                <p className="lead text-center">
                </p>
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
                    info="* Name"
                  />
                  <TextFieldGroup
                    type='date'
                    placeholder="* Quotation Date"
                    name="quotationDate"
                    value={formatDate(this.state.quotationDate, '-', 'ymd') }
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
                    value={formatDate(this.state.dueDate, '-', 'ymd') }
                    onChange={this.onChange}
                    error={errors.dueDate}
                    info="Due Date"
                  />
                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-info btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

AddQuotation.propTypes = {
  getClients: PropTypes.func.isRequired,
  addQuotation: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    clients: state.client.clients,
    //loading: state.quotation.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addQuotation, getClients, resetStore })(
  withRouter(AddQuotation)
);
