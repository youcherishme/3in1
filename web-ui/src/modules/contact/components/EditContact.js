import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import isEmpty from '../../common/validation/is-empty';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import InputGroup from '../../common/components/controls/InputGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';
import { addContact, getContact } from '../actions/contactActions';

class EditContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientid: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getContact(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.contact.contact) {
      const contact = nextProps.contact.contact;
      // Set component fields state
      this.setState({
        _id: contact._id,
        client: contact.client,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phoneNo: contact.phoneNo,
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const contactData = {
      _id: this.state._id,
      client: this.state.client,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phoneNo: this.state.phoneNo,
    };

    this.props.addContact(contactData, () => {
      //this.props.history.push(`/client/${contactData.client}`);
      this.props.history.goBack();
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.props.history.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Contact</h1>
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
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="Email"
                />
                <TextFieldGroup
                  placeholder="Phone No"
                  name="phoneNo"
                  value={this.state.phoneNo}
                  onChange={this.onChange}
                  error={errors.phoneNo}
                  info="Phone No"
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

EditContact.propTypes = {
  getContact: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  contact: state.contact,
  errors: state.errors
});

export default connect(mapStateToProps, { getContact, addContact })(
  withRouter(EditContact)
);
