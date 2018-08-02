import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';
import { addClient } from '../actions/clientActions';
import { resetStore } from '../../common/actions/commonActions';
import Spinner from '../../common/components/controls/Spinner';

class AddClient extends Component {
  constructor(props) {
    super(props);
    createdDate: new Date(),

      this.state = {
        userName: '',
        userEmail: '',
        userid: 0,

        name: '',
        firstName: '',
        lastName: '',
        description: '',
        clientType: 1,
        code: '',
        ein: '',
        phoneNo: '',
        createdDate: new Date(),
        ssn: '',
        ein: '',

        errors: {},
        disabled: false
      };

      this.onChange = this.onChange.bind(this);
      this.onClientTypeChange = this.onClientTypeChange.bind(this);
      
    this.onSubmit = this.onSubmit.bind(this);
    this.onClientTypeSelectChange = this.onClientTypeSelectChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      console.log('componentWillReceiveProps ', nextProps.errors);
      this.setState({ errors: nextProps.errors });
    }

    this.setState({
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,
    })    
  }
  onClientTypeSelectChange(event) {
    this.setState(
      {
        clientType: event.target.value,
      });
  }
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  onSubmit(e) {
    e.preventDefault();
debugger
    const clientData = {
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,

      name: this.state.name,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      description: this.state.description,
      code: this.state.code,
      ein: this.state.ein,
      clientType: this.state.clientType,
      phoneNo: this.state.phoneNo,
      createdDate: this.state.createdDate,
      ssn: this.state.ssn,
      ein: this.state.ein,
    };
    this.props.addClient(clientData, () => {
      this.goBack();
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onClientTypeChange(e) {
    const clientType =  e.target.value;
    this.setState({ [e.target.name]: clientType });
    if(clientType == 1)
    {

    }
  }

  render() {
    const { errors, loading } = this.props;
    const clientTypeOptions = [
      { label: 'Individual', value: 1 },
      { label: 'Business', value: 2 },
    ];

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
                <h1 className="display-4 text-center">Add Client</h1>
                <p className="lead text-center">
                </p>
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit}>

                  <SelectListGroup
                    placeholder="Client Type"
                    name="clientType"
                    value={this.state.clientType}
                    onChange={this.onClientTypeChange}
                    options={clientTypeOptions}
                    error={errors.clientType}
                    info="Client Type"
                  />

                  <TextFieldGroup
                    placeholder="Code"
                    name="code"
                    value={this.state.code}
                    onChange={this.onChange}
                    error={errors.code}
                    info="Code"
                  />
                  <TextFieldGroup
                    placeholder="* Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                    info="* Name"
                    hide={this.state.clientType == 1}
                  />
                  <TextFieldGroup
                    placeholder="* First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.onChange}
                    error={errors.firstName}
                    info="* First Name"
                    hide={this.state.clientType == 2}
                  />
                  <TextFieldGroup
                    placeholder="* Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.onChange}
                    error={errors.lastName}
                    info="* Last Name"
                    hide={this.state.clientType == 2}
                  />
                  <TextFieldGroup
                    placeholder="Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                    error={errors.description}
                    info="Description"
                  />

                  <TextFieldGroup
                    placeholder="Phone No"
                    name="phoneNo"
                    value={this.state.phoneNo}
                    onChange={this.onChange}
                    error={errors.phoneNo}
                    info="Phone No"
                  />
                  <TextFieldGroup
                    placeholder="EIN"
                    name="ein"
                    value={this.state.ein}
                    onChange={this.onChange}
                    error={errors.ein}
                    info="EIN"
                    hide={this.state.clientType == 1}
                  />
                  <TextFieldGroup
                    placeholder="SSN"
                    name="ssn"
                    value={this.state.ssn}
                    onChange={this.onChange}
                    error={errors.ssn}
                    info="SSN"
                    hide={this.state.clientType == 2}
                  />
                  
                  <input
                    type="submit"
                    value="Save"
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

AddClient.propTypes = {
  addClient: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  console.log('mapStateToProps ', state.errors);
  return {
    user: state.auth.user,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addClient, resetStore })(
  withRouter(AddClient)
);
