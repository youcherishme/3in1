import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import isEmpty from '../../common/validation/is-empty';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import InputGroup from '../../common/components/controls/InputGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';
import { addClient, getClient } from '../actions/clientActions';
import { resetStore  } from '../../common/actions/commonActions';

import ListContact from '../../contact/components/ListContact';

class EditClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userEmail: '',
      userid: 0,

      name: '',
      firstName: '',
      lastName: '',
      code: '',
      description: '',
      phoneNo: '',
      clientType: 1,
      ssn: '',
      ein: '',
      
      errors: {}
    };

    console.log('constructor ', this.state.errors);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClientTypeSelectChange = this.onClientTypeSelectChange.bind(this);    
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const userEmail = this.props.user.email;
    this.props.getClient(id, userEmail);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      console.log('componentWillReceiveProps ', nextProps.errors);
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.client) {
      const client = nextProps.client;
      // Set component fields state
      this.setState({
        userid: client.userid,
        userName: client.userName,
        userEmail: client.userEmail,

        _id: client._id,
        name: client.name,
        firstName: client.firstName,
        lastName: client.lastName,
        code: client.code,
        description: client.description,
        phoneNo: client.phoneNo,
        clientType: client.clientType,
        ssn: client.ssn,
        ein: client.ein,
      });
    }
    
  }
  onClientTypeSelectChange(event) {
    this.setState(
      {
        clientType: event.target.value,
      });
  }

  onSubmit(e) {
    e.preventDefault();
debugger
    const clientData = {
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,

      _id: this.state._id,
      name: this.state.name,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      code: this.state.code,
      description: this.state.description,
      phoneNo: this.state.phoneNo,
      clientType: this.state.clientType,
      ssn: this.state.ssn,
      ein: this.state.ein,
    };
    this.props.addClient(clientData, () => {
      this.goBack() ;
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  render() {
    const { errors } = this.state;
    const clientTypeOptions = [
      { label: 'Individual', value: 1 },
      { label: 'Business', value: 2 },
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Client</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <SelectListGroup
                  placeholder="Client Type"
                  name="clientType"
                  value={this.state.clientType}
                  onChange={this.onChange}
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
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListContact clientid= {`${this.props.match.params.id}`}  />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditClient.propTypes = {
  getClient: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  console.log('mapStateToProps ', state.errors);
  return {
    user: state.auth.user,
    client: state.client.client,
    errors: state.errors
  };
}

export default connect(mapStateToProps, { getClient, addClient, resetStore })(
  withRouter(EditClient)
);
