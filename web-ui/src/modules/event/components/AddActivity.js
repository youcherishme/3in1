import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import Spinner from '../../common/components/controls/Spinner';

import { addActivity } from '../../event/actions/activityActions';
import { resetStore  } from '../../common/actions/commonActions';

import _ from "lodash";
import { formatDate } from '../../common/utils/General';
import TimePicker from 'react-time-picker';

class AddActivity extends Component {
  state = {
    activityStartTime: '10:00',
  }
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userid: 0,
      userEmail: '',

      name: '',
      activityCategory: '',
      description: '',
      activityStartDate: new Date(),
      activityStartTime: '10:00',

      activityEndDate: new Date(),
      activityEndTime: '10:00',

      createdDate: new Date(),
      
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
    this.setState({
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const activityData = {
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,

      name: this.state.name,
      activityCategory: this.state.activityCategory,
      description: this.state.description,
      activityStartDate: this.state.activityStartDate,
      activityStartTime: this.state.activityStartTime,
      activityEndDate: this.state.activityEndDate,
      activityEndTime: this.state.activityEndTime,
      createdDate: this.state.createdDate,
    };
    debugger
    this.props.addActivity(activityData, () => {
      this.goBack();
    });
  }
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }
  
  onDayClick(date, jsActivity, view) {
    var url = `/add-activity/0/0/1`;
    this.props.history.push(url);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onStartTimeChange = activityStartTime => this.setState({ activityStartTime })
  onEndTimeChange = activityEndTime => this.setState({ activityEndTime })

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
                <h1 className="display-4 text-center">Add Activity</h1>
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
                  <TextFieldGroup
                    placeholder="Category"
                    name="activityCategory"
                    value={this.state.activityCategory}
                    onChange={this.onChange}
                    error={errors.activityCategory}
                    info="Category"
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
                    placeholder="Start Date"
                    name="activityStartDate"
                    value={formatDate(this.state.activityStartDate, '-', 'ymd')}
                    onChange={this.onChange}
                    error={errors.activityStartDate}
                    info="Start Date"
                  />

                  <TimePicker
                    onChange={this.onStartTimeChange}
                    value='10:00'
                  />
                  <TextFieldGroup
                    type='date'
                    placeholder="End Date"
                    name="activityEndDate"
                    value={formatDate(this.state.activityEndDate, '-', 'ymd')}
                    onChange={this.onChange}
                    error={errors.activityEndDate}
                    info="End Date"
                  />

                  <TimePicker
                    onChange={this.onEndTimeChange}
                    value='10:00'
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

AddActivity.propTypes = {
  addActivity: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    //loading: state.activity.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addActivity, resetStore })(
  withRouter(AddActivity)
);
