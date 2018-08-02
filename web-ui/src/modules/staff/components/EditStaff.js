import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import isEmpty from '../../common/validation/is-empty';
import { addStaff, getStaff } from '../actions/staffActions';
import { resetStore } from '../../common/actions/commonActions';

class EditStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      code: '',
      personalEmail: '',
      workingPhoneNo: '',
      workingEmail: '',
      homePhoneNo: '',

      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getStaff(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.staff.staff) {
      const staff = nextProps.staff.staff;
      // Set component fields state
      this.setState({
        _id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        code: staff.code,
        personalEmail: staff.personalEmail,
        workingEmail: staff.workingEmail,
        workingPhoneNo: staff.workingPhoneNo,
        homePhoneNo: staff.homePhoneNo,
      });
    }
  }
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  onSubmit(e) {
    e.preventDefault();

    const staffData = {
      _id: this.state._id,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      code: this.state.code,
      personalEmail: this.state.personalEmail,
      workingEmail: this.state.workingEmail,
      workingPhoneNo: this.state.workingPhoneNo,
      homePhoneNo: this.state.homePhoneNo,
    };

    this.props.addStaff(staffData, () => {
      this.goBack();
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
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Staff</h1>
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

EditStaff.propTypes = {
  getStaff: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  staff: state.staff,
  errors: state.errors
});

export default connect(mapStateToProps, { getStaff, addStaff, resetStore })(
  withRouter(EditStaff)
);
