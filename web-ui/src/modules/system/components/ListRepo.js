import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getRepos, deleteRepo } from '../actions/repoActions';
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListRepo extends Component {
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
    this.props.deleteRepo(id);
  }
  doSearch() {
    console.log('doSearch');
    this.props.getRepos(this.state.searchTerm);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  render() {
    const { loading } = this.props;

    var repoContent = <tr><td></td></tr>;
    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.repos) {
        repoContent = this.props.repos.map(repo => (
          <tr key={repo._id}>
            <td><Link to={`/repo/${repo._id}`}>{repo.repoCode}</Link></td>
            <td>{repo.companyName}</td>
            <td>{repo.contactName}</td>
            <td>{repo.contactEmail}</td>
            <td>{formatDate(repo.createdDate, '-', 'ymd')}</td>
            <td>
              <button
                onClick={this.onDeleteClick.bind(this, repo._id)}
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
              <h2 className="mb-4">Repos</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-repo`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Repo
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
                    <th>Code</th>
                    <th>Company Name</th>
                    <th>Contact Name</th>
                    <th>Contact Email</th>
                    <th>Created Date</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {repoContent}
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

ListRepo.propTypes = {
  deleteRepo: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    repos: state.repo.repos ? state.repo.repos : null,
    loading: state.repo.loading,
  };
};

export default connect(mapStateToProps, { getRepos, deleteRepo })(
  ListRepo
);
