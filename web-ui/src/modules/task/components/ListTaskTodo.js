import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addTask, getTask } from '../actions/taskActions';
import Spinner from '../../common/components/controls/Spinner';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import { getStaffs } from '../../staff/actions/staffActions';
import _ from "lodash";
import mongoose from 'mongoose';
import { formatDate } from '../../common/utils/General';

class ListTaskTodo extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    
    this.onAddTaskTodoClick = this.onAddTaskTodoClick.bind(this);
    this.onDeleteTaskTodoClick = this.onDeleteTaskTodoClick.bind(this);
    this.onSaveTaskTodosClick = this.onSaveTaskTodosClick.bind(this);
  }
  componentDidMount() {
    console.log('ListTaskTodo componentDidMount');
    const taskid = this.props.taskid;
    const userEmail = this.props.user.email;
    this.props.getTask(taskid, userEmail);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.task) {
      const task = nextProps.task;
      this.setState({
        userEmail: task.userEmail,
      });
    }    
  }
  onChange(e) {
    const { loading, task } = this.props;
    const { name, value } = e.target;

    const taskTodoField = name.split('_')[0];
    const taskTodoId = name.split('_')[1];

    const taskTodoIndex = _.findIndex(task.taskTodos, function (taskTodo) {
      return taskTodo._id == taskTodoId;
    });
    const path = 'taskTodos[' + taskTodoIndex + '].' + taskTodoField;
    _.set(task, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }
  onCheckboxChange(e) {
    const { loading, task } = this.props;
    const name = e.target.name;
    const value = e.target.checked ? 2 : 1;

    const taskTodoField = name.split('_')[0];
    const taskTodoId = name.split('_')[1];

    const taskTodoIndex = _.findIndex(task.taskTodos, function (taskTodo) {
      return taskTodo._id == taskTodoId;
    });
    const path = 'taskTodos[' + taskTodoIndex + '].' + taskTodoField;
    _.set(task, path, value);

    this.setState({ [e.target.name]: e.target.value });
  }

  onAddTaskTodoClick(e) {
    const { loading, task } = this.props;
    if (task && task.taskTodos) {
      var taskTodo = {
        _id: mongoose.Types.ObjectId().toString(),
        content: '',
      };
      task.taskTodos.push(taskTodo);

      this.forceUpdate();
    }
  }
  onDeleteTaskTodoClick(taskTodoId) {
    const { loading, task } = this.props;
    if (task && task.taskTodos && task.taskTodos) {
      const taskTodoIndex = _.findIndex(task.taskTodos, function (taskTodo) {
        return taskTodo._id == taskTodoId;
      });
      task.taskTodos.splice(taskTodoIndex, 1);

      this.forceUpdate();
    }
  }
  onSaveTaskTodosClick(e) {
    e.preventDefault();
    const { loading, task } = this.props;

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
    this.props.addTask(task, () => {
    });
  }

  render() {
    const { loading, task } = this.props;
    var taskTodoRowContent;

    if (loading) {
      taskTodoRowContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (task && task.taskTodos) {
        taskTodoRowContent = task.taskTodos.map(taskTodo => {
          return (
            <tr key={taskTodo._id}>
              <td>
                <TextFieldGroup
                  type='checkbox'
                  placeholder="Status"
                  name={'status_' + taskTodo._id}
                  checked={taskTodo.status == '2' ? 'checked' : ''}
                  value={true}
                  onChange={this.onCheckboxChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <TextFieldGroup
                  placeholder="Content"
                  name={'content_' + taskTodo._id}
                  value={taskTodo.content}
                  onChange={this.onChange}
                //error={errors.balanceDue}
                //                info="content"
                />
              </td>
              <td>
                <button
                  onClick={this.onDeleteTaskTodoClick.bind(this, taskTodo._id)}
                  className="btn-light">
                  <i className="fas fa-minus-circle text-info mr-1" />
                  Delete
                </button>
              </td>
            </tr >
          )
        }
        );
      }

    }
    return (
      <div>
        <h1 className="mb-4">Todos</h1>
        <button type="button" className="btn btn-info"
          onClick={this.onAddTaskTodoClick.bind(this)} >
          Add Todo
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {taskTodoRowContent}
          </tbody>
        </table>
        <input
          type="submit"
          value="Save Todo"
          onClick={this.onSaveTaskTodosClick}
          className="btn btn-info btn-block mt-4"
        />

      </div >

    );
  }
}

ListTaskTodo.propTypes = {
  //deleteTaskTodo: PropTypes.func.isRequired,
  //taskTodos: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    task: state.task.task,
    loading: state.task.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getTask, addTask })(
  ListTaskTodo
);
