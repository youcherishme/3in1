import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProjects, deleteProject } from '../actions/projectActions';
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListProject extends Component {
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
    console.log('ListProject componentDidMount');
    this.doSearch();
  }
  doSearch() {
    console.log('doSearch');
    this.props.getProjects(this.state.searchTerm,  this.props.user.email);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  onDeleteClick(id) {
    const userEmail = this.props.user.email;
    this.props.deleteProject(id, userEmail);
  }

  render() {
    const { loading } = this.props;

    var attacherid;
    var attacherTag;
    var attacherType;
    if (this.props.attacherType === undefined) {
      attacherid = 0;
      attacherTag = '0';
      attacherType = require('../../common/constants').MODULE_ALL;
    }
    else {
      attacherid = this.props.attacherid;
      attacherTag = this.props.attacherTag;
      attacherType = this.props.attacherType;
    }

    var projectContent;

    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.projects) {
        projectContent = this.props.projects.map(project => (
          <tr key={project._id}>
            <td><Link to={`/project/${project._id}`}>{project.code}</Link></td>
            <td>{project.name}</td>
            <td>{formatDate(project.startDate, '/')}</td>
            <td>{formatDate(project.endDate, '/')}</td>

            <td><Link to={`/client/${project.client}`}>{project.clientName}</Link></td>
            <td><Link to={`/case/${project.user}`}>{project.userName}</Link></td>
            <td>
              <button
                onClick={this.onDeleteClick.bind(this, project._id)}
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
              <h2 className="mb-4">Projects</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-project/${attacherid}/${attacherTag}/${attacherType}`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Project
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
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Client</th>
              <th>User</th>
              <th />
            </tr>
          </thead>
                <tbody>
                  {projectContent}
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

ListProject.propTypes = {
  deleteProject: PropTypes.func.isRequired,
  //projects: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    projects: state.project.projects ? state.project.projects : null,
    loading: state.project.loading,
  };
};

export default connect(mapStateToProps, { getProjects, deleteProject })(
  ListProject
);
