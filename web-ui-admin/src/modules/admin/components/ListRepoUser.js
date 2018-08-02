import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getRepoUsers, deleteRepoUser } from '../actions/repoUserActions';
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListRepoUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      timeout: null,
    }
    this.onChange = this.onChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }
  componentDidMount() {
    this.timer = null;
    this.doSearch();
  }
  onDeleteClick(id) {
    this.props.deleteRepoUser(id);
  }
  doSearch() {
    console.log('doSearch');
    this.props.getRepoUsers(this.state.searchTerm, this.props.user.email);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  render() {
    const { loading } = this.props;

    var repoUserContent = <tr><td></td></tr>;
    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.repoUsers) {
        repoUserContent = this.props.repoUsers.map(repoUser => (
          <tr key={repoUser._id}>
            <td>{repoUser.userEmail}</td>
            <td>
              <button
                onClick={this.onDeleteClick.bind(this, repoUser._id)}
                className="btn-light">
                <i className="fas fa-minus-circle text-info mr-1" />
                Delete
              </button>
            </td>
          </tr>
        ));
      }

    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="mb-4">Users</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-repoUser`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add User
              </Link>
            </div>
            <div className="col">
              <TextFieldGroup
                placeholder="Search..."
                value={this.state.searchTerm}
                onChange={this.onChange}
                name="searchTerm"
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table">
                <thead>
                  <tr>
                  <th>User Email</th>
                  <th></th>
                  </tr>
                </thead>
                <tbody>
                  {repoUserContent}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {loadingContent}
            </div>
          </div>

        </div>
      </div>

    );
  }
}

ListRepoUser.propTypes = {
  deleteRepo: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    repoUsers: state.repoUser.repoUsers ? state.repoUser.repoUsers : null,
    loading: state.repoUser.loading,
  };
};

export default connect(mapStateToProps, { getRepoUsers, deleteRepoUser })(
  ListRepoUser
);
