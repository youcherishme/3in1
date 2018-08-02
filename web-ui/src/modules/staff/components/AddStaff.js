import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import { addStaff } from '../actions/staffActions';
import { resetStore } from '../../common/actions/commonActions';
import Spinner from '../../common/components/controls/Spinner';

class AddStaff extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      personalEmail: '',
      workingEmail: '',
      code: '',
      homePhoneNo: '',
      workingPhoneNo: '',
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
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  onSubmit(e) {
    e.preventDefault();

    const staffData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      code: this.state.code,
      personalEmail: this.state.personalEmail,
      workingEmail: this.state.workingEmail,
      homePhoneNo: this.state.homePhoneNo,
      workingPhoneNo: this.state.workingPhoneNo,
      createdDate: this.state.createdDate,
    };
    this.props.addStaff(staffData, () => {
      this.goBack();
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
                <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
                <h1 className="display-4 text-center">Add Staff</h1>
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
                    placeholder="Code"
                    name="code"
                    value={this.state.code}
                    onChange={this.onChange}
                    error={errors.code}
                    info="Code"
                  />
                  <TextFieldGroup
                    placeholder="Home Phone"
                    name="homePhoneNo"
                    value={this.state.homePhoneNo}
                    onChange={this.onChange}
                    error={errors.homePhoneNo}
                    info="Phone No"
                  />
                  <TextFieldGroup
                    placeholder="Working Phone"
                    name="workingPhoneNo"
                    value={this.state.workingPhoneNo}
                    onChange={this.onChange}
                    error={errors.workingPhoneNo}
                    info="Working Phone"
                  />
                  <TextFieldGroup
                    placeholder="Personal Email"
                    name="personalEmail"
                    value={this.state.personalEmail}
                    onChange={this.onChange}
                    error={errors.personalEmail}
                    info="Personal Email"
                  />
                  <TextFieldGroup
                    placeholder="Working Email"
                    name="workingEmail"
                    value={this.state.workingEmail}
                    onChange={this.onChange}
                    error={errors.workingEmail}
                    info="Working Email"
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

AddStaff.propTypes = {
  addStaff: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    //loading: state.staff.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addStaff, resetStore })(
  withRouter(AddStaff)
);
