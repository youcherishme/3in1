import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import isEmpty from '../../common/validation/is-empty';

import { addTask, getTask } from '../actions/taskActions';
import { resetStore } from '../../common/actions/commonActions';

import { PRIORITY_OPTIONS } from '../../common/commonSets';

import Spinner from '../../common/components/controls/Spinner';
import _ from "lodash";
import { formatDate } from '../../common/utils/General';

import ListTaskTodo from './ListTaskTodo';
import ListComment from '../../comment/components/ListComment';

class EditTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      priority: 0,
      description: '',
      dueDate: '',

      userName: '',
      userid: 0,
      userEmail: '',

      errors: {},

    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    console.log('EditTask componentDidMount');
    const { id } = this.props.match.params;
    const userEmail = this.props.user.email;
    this.props.getTask(id, userEmail);
  }

  componentWillReceiveProps(nextProps) {
    console.log('EditTask  componentWillReceiveProps');
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.task) {
      const task = nextProps.task;
      this.setState({
        _id: task._id,
        name: task.name,
        priority: task.priority,
        description: task.description,
        dueDate: task.dueDate,

        userid: task.userid,
        userName: task.userName,
        userEmail: task.userEmail,
      });
    }
  }
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  onSubmit(e) {
    e.preventDefault();
    var staffOption = _.find(this.staffOptions, { value: this.state.staffid });

    const taskData = {
      _id: this.state._id,
      name: this.state.name,
      priority: this.state.priority,
      description: this.state.description,
      dueDate: this.state.dueDate,

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,
    };
    this.props.addTask(taskData, () => {
      this.goBack();
    });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { loading } = this.props;
    const { errors } = this.state;
    const MODULE_TYPE = require('../../common/constants').MODULE_TASK;
    const priorityOptions = PRIORITY_OPTIONS

    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {

    }
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col">
              {loadingContent}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Task</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  info="* Name"
                />
                <SelectListGroup
                  placeholder="* Select Priority..."
                  name="priority"
                  value={this.state.priority}
                  onChange={this.onChange}
                  options={priorityOptions}
                  error={errors.priority}
                  info="Priority"
                />
                <TextFieldGroup
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="Description"
                />
                <TextFieldGroup
                  type='date'
                  placeholder="Due Date"
                  name="dueDate"
                  value={formatDate(this.state.dueDate, '-', 'ymd')}
                  onChange={this.onChange}
                  error={errors.dueDate}
                  info="Due Date"
                />
                <input
                  type="submit"
                  value="Save"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 m-auto">
              <hr />
              <ListTaskTodo taskid={`${this.props.match.params.id}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr />
              <ListComment attacherid={`${this.props.match.params.id}`} attacherType={`${MODULE_TYPE}`} />
            </div>
          </div>

        </div>
      </div>
    );
  }
}

EditTask.propTypes = {
  getTask: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    loading: state.task.loading,
    user: state.auth.user,
    task: state.task.task,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getTask, addTask, resetStore })(
  withRouter(EditTask)
);
