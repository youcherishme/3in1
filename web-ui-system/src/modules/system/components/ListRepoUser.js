import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addRepo, getRepo } from '../actions/repoActions';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

import _ from "lodash";
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';

import mongoose from 'mongoose';

class ListRepoUser extends Component {
  componentDidMount() {
    console.log('ListRepoUser componentDidMount');
    //const repoid = this.props.repoid;
    const repoid = '5b3b659d8a59ff0207c39a07'
    this.props.getRepo(repoid);

    this.onChange = this.onChange.bind(this);
    this.onAddRepoUserClick = this.onAddRepoUserClick.bind(this);
    this.onDeleteRepoUserClick = this.onDeleteRepoUserClick.bind(this);
    this.onResetPasswordClick = this.onResetPasswordClick.bind(this);
    
    this.onSaveRepoUsersClick = this.onSaveRepoUsersClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

  }
  onChange(e) {
    const { loading, repo } = this.props;
    const { name, value } = e.target;

    const repoUserField = name.split('_')[0];
    const repoUserId = name.split('_')[1];

    const repoUserIndex = _.findIndex(repo.repoUsers, function (repoUser) {
      return repoUser._id == repoUserId;
    });
    const path = 'repoUsers[' + repoUserIndex + '].' + repoUserField;
    _.set(repo, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }
  onAddRepoUserClick(e) {
    debugger
    const { loading, repo } = this.props;
    if (repo && repo.repoUsers) {
      var repoUser = {
        _id: mongoose.Types.ObjectId().toString(),
        userEmail: '',
      };
      repo.repoUsers.push(repoUser);

      this.forceUpdate();
    }
  }
  onDeleteRepoUserClick(repoUserId) {
    const { loading, repo } = this.props;
    if (repo && repo.repoUsers && repo.repoUsers) {
      const repoUserIndex = _.findIndex(repo.repoUsers, function (repoUser) {
        return repoUser._id == repoUserId;
      });
      repo.repoUsers.splice(repoUserIndex, 1);

      this.forceUpdate();
    }
  }
  onResetPasswordClick(repoUserId) {
    const { loading, repo } = this.props;
    if (repo && repo.repoUsers && repo.repoUsers) {
      const repoUserIndex = _.findIndex(repo.repoUsers, function (repoUser) {
        return repoUser._id == repoUserId;
      });
      //ttt send email

    }
  }
  onSaveRepoUsersClick(e) {
    e.preventDefault();
    const { loading, repo } = this.props;

    this.props.addRepo(repo, () => {
    });
  }
  render() {
    const { loading, repo } = this.props;
    var repoUserRowUserContent;

    if (loading) {
      repoUserRowUserContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (repo && repo.repoUsers ) {
        repoUserRowUserContent = repo.repoUsers.map(repoUser => {
          return (
            <tr key={repoUser._id}>
              <td>
                <TextFieldGroup
                  placeholder="User Email"
                  name={'userEmail_' + repoUser._id}
                  value={repoUser.userEmail}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="userEmail"
                />
              </td>

              <td>
                <button
                  onClick={this.onDeleteRepoUserClick.bind(this, repoUser._id)}
                  className="btn-light">
                  <i className="fas fa-minus-circle text-info mr-1" />
                  Delete
                </button>

              </td>
              <td>
                <button
                  onClick={this.onResetPasswordClick.bind(this, repoUser._id)}
                  className="btn-light">
                  <i className="far fa-envelope text-info mr-1" />
                  Send Reset Password
                </button>

              </td>
            </tr>
          )
        }
        );
      }

    }
    return (
      <div>
        <h1 className="mb-4">Users</h1>
        <button type="button" className="btn btn-info"
          onClick={this.onAddRepoUserClick.bind(this)} >
          Add User
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>User Email</th>
            </tr>
          </thead>
          <tbody>
            {repoUserRowUserContent}
          </tbody>
        </table>
        <input
          type="submit"
          value="Save Users"
          onClick={this.onSaveRepoUsersClick}
          className="btn btn-info btn-block mt-4"
        />

      </div>

    );
  }
}

ListRepoUser.propTypes = {
  //deleteRepoUser: PropTypes.func.isRequired,
  //repoUsers: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    repo: state.repo.repo,
    loading: state.repo.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getRepo, addRepo })(
  ListRepoUser
);
