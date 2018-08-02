import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTasksByAttacher, deleteTask } from '../actions/taskActions';

import Spinner from '../../common/components/controls/Spinner';
import { formatDate, getModuleName } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListTask extends Component {
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
    console.log('ListTask componentDidMount');

    var attacherid;
    var attacherType;
    if (this.props.attacherType === undefined) {
      attacherid = 0;
      attacherType = require('../../common/constants').MODULE_ALL;
    }
    else {
      attacherid = this.props.attacherid;
      attacherType = this.props.attacherType;
    }
    this.doSearch();
  }
  doSearch() {
    console.log('doSearch');
    var attacherid;
    var attacherType;
    if (this.props.attacherType === undefined) {
      attacherid = 0;
      attacherType = require('../../common/constants').MODULE_ALL;
    }
    else {
      attacherid = this.props.attacherid;
      attacherType = this.props.attacherType;
    }
    this.props.getTasksByAttacher(attacherid, attacherType, this.state.searchTerm,  this.props.user.email);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  onDeleteClick(id) {
    const userEmail = this.props.user.email;
    this.props.deleteTask(id, userEmail);
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

    var taskContent = <tr><td></td></tr>;
    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.tasks) {
        taskContent = this.props.tasks.map(task => {
          var linkTo = '';
          linkTo = '/' + getModuleName(task.attacherType) + '/' + task.attacherid;
          return (
            <tr key={task._id}>
              <td><Link to={`/task/${task._id}`}>{task.name}</Link></td>
              <td>{task.priority}</td>
              <td>{formatDate(task.dueDate, '/')}</td>
              <td><Link to={`/staff/${task.user}`}>{task.userName}</Link></td>
              {attacherType != require('../../common/constants').MODULE_ALL ? '' : <td><Link to={linkTo}> {task.attacherType == 0 || task.attacherType == 1 ? '' : task.attacherTag}</Link></td>}
              <td>
                <button
                  onClick={this.onDeleteClick.bind(this, task._id)}
                  className="btn-light">
                  <i className="fas fa-minus-circle text-info mr-1" />
                  Delete
                </button>
              </td>
            </tr>
          );
        }
        );
      }

    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="mb-4">Tasks</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-task/${attacherid}/${attacherTag}/${attacherType}`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Task
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
                    <th>Name</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>User</th>
                    <th>Link To</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {taskContent}
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

ListTask.propTypes = {
  deleteTask: PropTypes.func.isRequired,
  //tasks: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    tasks: state.task.tasks ? state.task.tasks : null,
    loading: state.task.loading,
  };
};

export default connect(mapStateToProps, { getTasksByAttacher, deleteTask })(
  ListTask
);
