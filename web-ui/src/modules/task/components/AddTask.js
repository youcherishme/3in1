import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import Spinner from '../../common/components/controls/Spinner';
import { PRIORITY_OPTIONS } from '../../common/commonSets';

import { addTask } from '../actions/taskActions';
import { resetStore  } from '../../common/actions/commonActions';

import _ from "lodash";
import { formatDate } from '../../common/utils/General';

class AddTask extends Component {
  constructor(props) {
    super(props);

    const { attacherid, attacherTag, attacherType } = this.props.match.params;

    this.state = {
      attacherid: attacherid,
      attacherTag: attacherTag,
      attacherType: attacherType,

      userName: '',
      userid: 0,
      userEmail: '',

      name: '',
      priority: '',
      description: '',
      dueDate: new Date(),

      errors: {},
      disabled: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.staffs) {
      const originalStaffs = nextProps.staffs;
      var staffOptions = _.map(originalStaffs, function (staffOption) {
        return {
          value: staffOption._id,
          label: staffOption.firstName + ' ' + staffOption.lastName,
        }
      });
      this.staffOptions = staffOptions;
      //set default to first item
      var defaultValue = this.staffOptions && this.staffOptions.length > 0 ? this.staffOptions[0].value : this.state.staffid;
      this.setState(
        {
          staffid: defaultValue,
        });
    }

    this.setState({
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,
    })    
  }

  onSubmit(e) {
    e.preventDefault();

    const taskData = {
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,

      name: this.state.name,
      priority: this.state.priority,
      description: this.state.description,
      dueDate: this.state.dueDate,

      attacherid: this.state.attacherid,
      attacherTag: this.state.attacherTag,
      attacherType: this.state.attacherType,
      createdDate: this.state.createdDate,

      createdDate: new Date(),
    };
    this.props.addTask(taskData, () => {
      this.goBack();
    });
  }
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, loading } = this.props;
    const priorityOptions = PRIORITY_OPTIONS

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
                <h1 className="display-4 text-center">Add Task</h1>
                <p className="lead text-center">
                </p>
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
                  
                  <TextAreaFieldGroup
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
                    value="Submit"
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

AddTask.propTypes = {
  addTask: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    //loading: state.task.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addTask, resetStore  })(
  withRouter(AddTask)
);
