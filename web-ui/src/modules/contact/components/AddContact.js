import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';

import { addContact } from '../actions/contactActions';
import Spinner from '../../common/components/controls/Spinner';

class AddContact extends Component {
  constructor(props) {
    super(props);

    const { clientid } = this.props.match.params;
    
    this.state = {
      clientid: clientid,
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      createdDate: new Date(),
      
      errors: {},
      disabled: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const contactData = {
      clientid: this.state.clientid,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phoneNo: this.state.phoneNo,
      createdDate: this.state.createdDate,
    };
    this.props.addContact(contactData, () => {
      //this.props.history.push(`/client/${contactData.clientid}`);
      this.props.history.goBack();
    });
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
                <button className="btn btn-light" onClick={() => this.props.history.goBack()}>Go Back</button>
                <h1 className="display-4 text-center">Add Contact</h1>
                <p className="lead text-center">
                </p>
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="* First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.onChange}
                    error={errors.firstName}
                    info="* First Name"
                  />
                  <TextFieldGroup
                    placeholder="* Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.onChange}
                    error={errors.lastName}
                    info="* Last Name"
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
                    placeholder="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                    info="Email"
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

AddContact.propTypes = {
  addContact: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    //loading: state.contact.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addContact })(
  withRouter(AddContact)
);
