import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import isEmpty from '../../common/validation/is-empty';

import { addActivity, getActivity } from '../actions/activityActions';
import { getClients } from '../../client/actions/clientActions';
import { resetStore  } from '../../common/actions/commonActions';

import Spinner from '../../common/components/controls/Spinner';

import _ from "lodash";
import { formatDate } from '../../common/utils/General';

import TimePicker from 'react-time-picker';

class EditActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      activityCategory: '',
      description: '',
      activityStartDate: '',
      activityStartTime: '',
      activityEndDate: '',
      activityEndTime: '',

      userName: '',
      userid: 0,

      clientid: '0',
      clientName: '',

      errors: {},
    };

    this.clientOptions = [];
    this.handleClientChange = this.handleClientChange.bind(this);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getActivity(id);

    this.props.getClients();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.activity) {
      const activity = nextProps.activity;
      this.setState({
        _id: activity._id,
        name: activity.name,
        activityCategory: activity.activityCategory,
        description: activity.description,
        activityStartDate: activity.activityStartDate,
        activityStartTime: activity.activityStartTime,
        activityEndDate: activity.activityEndDate,
        activityEndTime: activity.activityEndTime,
        userid: activity.userid,
        userName: activity.userName,

        clientid: activity.client,
        clientName: activity.clientName,
      });
    }
    if (nextProps.clients) {
      const originalClients = nextProps.clients;
      var selectedItem = {};
      var selectedClientId = this.state.clientid;
      var clientOptions = _.map(originalClients, function (client) {
        const clientOption = {
          id: client._id,
          name: client.name,
          code: client.code,
          phoneNo: client.phoneNo,

          value: client._id,
          label: client.name,
        }
        if (client._id == selectedClientId)
          selectedItem = clientOption;

        return clientOption;
      });
      this.clientOptions = clientOptions;

      //set default item
      this.setState({
        selectedOption: selectedItem
      });

    }

  }

  onSubmit(e) {
    e.preventDefault();
    const activityData = {
      _id: this.state._id,
      name: this.state.name,
      activityCategory: this.state.activityCategory,
      description: this.state.description,
      activityStartDate: this.state.activityStartDate,
      activityStartTime: this.state.activityStartTime,
      activityEndDate: this.state.activityEndDate,
      activityEndTime: this.state.activityEndTime,
      clientid: this.state.selectedOption.id,
      clientName: this.state.selectedOption.name,
    };

    this.props.addActivity(activityData, () => {
      this.goBack();
    });
  }

  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }
  
  onTimeChange = activityStartTime => this.setState({ activityStartTime })

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  //filter client item
  clientFilterOption = (option, filter) => {
    if (option && option.name && option.code && option.phoneNo) {
      if (
        option.name.toLowerCase().search(filter.toLowerCase()) >= 0
        || option.code.toLowerCase().search(filter.toLowerCase()) >= 0
        || option.phoneNo.toLowerCase().search(filter.toLowerCase()) >= 0
      ) {
        return true;
      }
    }
  }

  //render items
  clientOptionRender = (item, index) => {
    return (
      <div key={index}>
        <b>{item.name}</b><br />
        <span>{item.code}</span><br />
        <span>{item.phoneNo}</span>
        <br className="clear" />
      </div>
    );
  }

  handleClientChange = (selectedItem, index) => {
    this.setState({
      selectedOption: selectedItem
    });
  }
  render() {
    const { errors } = this.state;
    const MODULE_TYPE = require('../../common/constants').MODULE_APPOINTMENT;

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Activity</h1>
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
                  placeholder="Start Date"
                  name="activityStartDate"
                  value={formatDate(this.state.activityStartDate, '-', 'ymd')}
                  onChange={this.onChange}
                  error={errors.activityStartDate}
                  info="Start Date"
                />
                <TimePicker
                  name='activityStartTime'
                  onChange={this.onTimeChange}
                  value={this.state.activityStartTime}
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
                  name='activityEndTime'
                  onChange={this.onTimeChange}
                  value={this.state.activityEndTime}
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

EditActivity.propTypes = {
  getClients: PropTypes.func.isRequired,
  getActivity: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    clients: state.client.clients,
    activity: state.activity.activity,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getActivity, addActivity, getClients, resetStore })(
  withRouter(EditActivity)
);
