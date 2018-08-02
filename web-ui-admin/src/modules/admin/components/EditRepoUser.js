import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import isEmpty from '../../common/validation/is-empty';
import { addRepoUser, getRepoUser } from '../actions/repoUserActions';
import { resetStore } from '../../common/actions/commonActions';

class EditRepoUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',

      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getRepoUser(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.repoUser.repoUser) {
      const repoUser = nextProps.repoUser.repoUser;
      // Set component fields state
      this.setState({
        _id: repoUser._id,
        userEmail: repoUser.userEmail,
      });
    }
  }
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  onSubmit(e) {
    e.preventDefault();

    const repoUserData = {
      _id: this.state._id,
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
    const { errors } = this.state;
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit User</h1>
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

EditRepoUser.propTypes = {
  getRepoUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  repoUser: state.repoUser,
  errors: state.errors
});

export default connect(mapStateToProps, { getRepoUser, addRepoUser, resetStore })(
  withRouter(EditRepoUser)
);
