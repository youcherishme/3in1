import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import { addRepoUser } from '../actions/repoUserActions';
import { resetStore } from '../../common/actions/commonActions';
import Spinner from '../../common/components/controls/Spinner';

class AddRepoUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: '',

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

    const repoUserData = {
      adminEmail: this.props.user.email,
      userEmail: this.state.userEmail,
    };
    this.props.addRepoUser(repoUserData, () => {
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
                <h1 className="display-4 text-center">Add User</h1>
                <p className="lead text-center">
                </p>
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="User Email"
                    name="userEmail"
                    value={this.state.userEmail}
                    onChange={this.onChange}
                    error={errors.userEmail}
                    info="User Email"
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

AddRepoUser.propTypes = {
  addRepoUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    //loading: state.repo.loading,
    user: state.auth.user,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addRepoUser, resetStore })(
  withRouter(AddRepoUser)
);
