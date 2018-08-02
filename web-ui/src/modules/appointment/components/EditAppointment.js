import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';
import AutoSuggestFieldGroup from '../../common/components/controls/AutoSuggestFieldGroup';

import isEmpty from '../../common/validation/is-empty';

import { addAppointment, getAppointment } from '../actions/appointmentActions';
import { getClients } from '../../client/actions/clientActions';
import { resetStore  } from '../../common/actions/commonActions';
import { CATEGORY_OPTIONS } from '../../common/commonSets';

import Spinner from '../../common/components/controls/Spinner';

import _ from "lodash";
import { formatDate } from '../../common/utils/General';

import ListComment from '../../comment/components/ListComment';
import ListDocument from '../../document/components/ListDocument';
import TimePicker from 'react-time-picker';

class EditAppointment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      appointmentCategory: 0,
      description: '',
      appointmentDate: '',
      appointmentTime: '',

      userName: '',
      userid: 0,
      userEmail: '',

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
    const userEmail = this.props.user.email;
    this.props.getAppointment(id, userEmail);
    this.props.getClients('*',  this.props.user.email);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.appointment) {
      const appointment = nextProps.appointment;
      this.setState({
        _id: appointment._id,
        name: appointment.name,
        appointmentCategory: appointment.appointmentCategory,
        description: appointment.description,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        userid: appointment.userid,
        userName: appointment.userName,
        userEmail: appointment.userEmail,

        clientid: appointment.client,
        clientName: appointment.clientName,
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
    const appointmentData = {
      _id: this.state._id,
      name: this.state.name,
      appointmentCategory: this.state.appointmentCategory,
      description: this.state.description,
      appointmentDate: this.state.appointmentDate,
      appointmentTime: this.state.appointmentTime,
      clientid: this.state.selectedOption.id,
      clientName: this.state.selectedOption.name,

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,      
    };

    this.props.addAppointment(appointmentData, () => {
      this.goBack();
    });
  }
  onTimeChange = appointmentTime => this.setState({ appointmentTime })
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

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
    const categoryOptions = CATEGORY_OPTIONS

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Appointment</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <AutoSuggestFieldGroup
                  id="client"
                  name="client"
                  value={this.state.selectedOption}
                  onChange={this.handleClientChange}
                  options={this.clientOptions}
                  optionRenderer={this.clientOptionRender}
                  //multi
                  filterOption={this.clientFilterOption}
                  removeSelected={true}
                  error={errors.name}
                  info="* Client"
                />

                <TextFieldGroup
                  placeholder="* Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  info="* Name"
                />
                <SelectListGroup
                  placeholder="* Select Category..."
                  name="appointmentCategory"
                  value={this.state.appointmentCategory}
                  onChange={this.onChange}
                  options={categoryOptions}
                  error={errors.category}
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
                  placeholder="Date"
                  name="appointmentDate"
                  value={formatDate(this.state.appointmentDate, '-', 'ymd')}
                  onChange={this.onChange}
                  error={errors.appointmentDate}
                  info="Date"
                />
                <TimePicker
                  name='appointmentTime'
                  onChange={this.onTimeChange}
                  value={this.state.appointmentTime}
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
              <ListComment attacherid={`${this.props.match.params.id}`} attacherType={`${MODULE_TYPE}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr />
              <ListDocument attacherid={`${this.props.match.params.id}`} attacherType={`${MODULE_TYPE}`} />
            </div>
          </div>

        </div>
      </div>
    );
  }
}

EditAppointment.propTypes = {
  getClients: PropTypes.func.isRequired,
  getAppointment: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    clients: state.client.clients,
    appointment: state.appointment.appointment,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getAppointment, addAppointment, getClients, resetStore })(
  withRouter(EditAppointment)
);
