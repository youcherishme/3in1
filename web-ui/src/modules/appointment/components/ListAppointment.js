import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAppointmentsByAttacher, deleteAppointment } from '../actions/appointmentActions';

import Spinner from '../../common/components/controls/Spinner';
import { formatDate, getModuleName } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListAppointment extends Component {
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
    console.log('ListAppointment componentDidMount');

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

    this.timer = null;
    this.props.getAppointmentsByAttacher(attacherid, attacherType, this.state.searchTerm,  this.props.user.email);
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
    this.props.getAppointmentsByAttacher(attacherid, attacherType, this.state.searchTerm,  this.props.user.email);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }
  onDeleteClick(id) {
    const userEmail = this.props.user.email;
    this.props.deleteAppointment(id, userEmail);
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

    var appointmentContent = <tr><td></td></tr>;
    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.appointments) {
        appointmentContent = this.props.appointments.map(appointment => {
          var linkTo = '';
          linkTo = '/' + getModuleName(appointment.attacherType) + '/' + appointment.attacherid;
          return (
            <tr key={appointment._id}>
              <td><Link to={`/appointment/${appointment._id}`}>{appointment.name}</Link></td>
              <td>{appointment.appointmentCategory}</td>
              <td>{formatDate(appointment.appointmentDate, '/')}</td>
              <td><Link to={`/staff/${appointment.user}`}>{appointment.userName}</Link></td>
              {attacherType != require('../../common/constants').MODULE_ALL ? '' : <td><Link to={linkTo}> {appointment.attacherType == 0 || appointment.attacherType == 1 ? '' : appointment.attacherTag}</Link></td>}
              <td>
                <button
                  onClick={this.onDeleteClick.bind(this, appointment._id)}
                  className="btn-light">
                  <i className="fas fa-minus-circle text-info mr-1" />
                  Delete
              </button>
              </td>
            </tr>
          );
        });
      }

    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="mb-4">Appointments</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-appointment/${attacherid}/${attacherTag}/${attacherType}`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Appointment
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
                    <th>Category</th>
                    <th>Date</th>
                    <th>User</th>
                    {attacherType != require('../../common/constants').MODULE_ALL ? '' : <th>Link to</th>}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {appointmentContent}
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

ListAppointment.propTypes = {
  deleteAppointment: PropTypes.func.isRequired,
  //appointments: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    appointments: state.appointment.appointments ? state.appointment.appointments : null,
    loading: state.appointment.loading,
  };
};

export default connect(mapStateToProps, { getAppointmentsByAttacher, deleteAppointment })(
  ListAppointment
);
