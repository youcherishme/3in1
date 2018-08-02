import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getActivitysByAttacher } from '../../event/actions/activityActions';
import { getAppointmentsByAttacher } from '../../appointment/actions/appointmentActions';
import { getTasksByAttacher } from '../../task/actions/taskActions';
import { getCases } from '../../case/actions/caseActions';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

import Spinner from '../../common/components/controls/Spinner';
import { formatDate, getModuleName } from '../../common/utils/General';
import FullCalendar from 'fullcalendar-reactwrapper';
import _ from "lodash";

class ListEvent extends Component {
  constructor() {
    super();
    this.onDayClick = this.onDayClick.bind(this);
    this.onEventClick = this.onEventClick.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);

    this.state = {
      events: [],
      activitys: [],
      appointments: [],
      tasks: [],
      cases: [],

      isActivityChecked: false,
      isAppointmentChecked: false,
      isTaskChecked: false,
      isCaseChecked: false,
    };

  }
  componentDidMount() {
    console.log('ListEvent componentDidMount');

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
  }
  componentWillReceiveProps(nextProps) {
    var allEvents = [];
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.activitys && this.state.isActivityChecked) {
      var originalActivitys = nextProps.activitys;
      const moduleName = getModuleName(require('../../common/constants').MODULE_ACTIVITY);
      var activityOptions = _.map(originalActivitys, function (activityOption) {
        return {
          id: activityOption._id,
          title: activityOption.name,
          start: formatDate(activityOption.activityStartDate, '-', 'ymd') + 'T' + activityOption.activityStartTime,
          end: formatDate(activityOption.activityEndDate, '-', 'ymd') + 'T' + activityOption.activityEndTime,
          backgroundColor: '#00FF00',
          moduleName: moduleName,
        }
      });
      allEvents = allEvents.concat(activityOptions);

      this.setState({
        events: allEvents,
      })
    }
    if (nextProps.appointments && this.state.isAppointmentChecked) {
      var originalAppointments = nextProps.appointments;
      const moduleName = getModuleName(require('../../common/constants').MODULE_APPOINTMENT);
      var appointmentOptions = _.map(originalAppointments, function (appointmentOption) {
        return {
          id: appointmentOption._id,
          title: appointmentOption.name,
          start: formatDate(appointmentOption.appointmentDate, '-', 'ymd') + 'T' +  appointmentOption.appointmentTime,
          backgroundColor: '#08E236',
          moduleName: moduleName,
        }
      });
      allEvents = allEvents.concat(appointmentOptions);
      this.setState({
        events: allEvents,
      })
    }
    if (nextProps.tasks && this.state.isTaskChecked) {
      var originalTasks = nextProps.tasks;
      const moduleName = getModuleName(require('../../common/constants').MODULE_TASK);
      var taskOptions = _.map(originalTasks, function (taskOption) {
        return {
          id: taskOption._id,
          title: taskOption.name,
          start: formatDate(taskOption.dueDate, '-', 'ymd') + 'T10:00',
          backgroundColor: '#41C5E8',
          moduleName: moduleName,
        }
      });
      allEvents = allEvents.concat(taskOptions);
      this.setState({
        events: allEvents,
      })
    }    
    if (nextProps.cases && this.state.isCaseChecked) {
      var originalCases = nextProps.cases;
      const moduleName = getModuleName(require('../../common/constants').MODULE_CASE);
      var caseOptions = _.map(originalCases, function (caseOption) {
        return {
          id: caseOption._id,
          title: caseOption.name,
          start: formatDate(caseOption.openDate, '-', 'ymd') + 'T10:00',
          backgroundColor: '#AADFB4',
          moduleName: moduleName,
        }
      });
      allEvents = allEvents.concat(caseOptions);

      var caseOptions = _.map(originalCases, function (caseOption) {
        return {
          id: caseOption._id,
          title: caseOption.name,
          start: formatDate(caseOption.statuteOfLimitations, '-', 'ymd') + 'T10:00',
          backgroundColor: '#AADFB4',
        }
      });
      allEvents = allEvents.concat(caseOptions);

      this.setState({
        events: allEvents,
      })
    }
  }
  onCheckboxChange(e) {
    const name = e.target.name;
    const value = e.target.checked ? 2 : 1;
    this.setState({ [e.target.name]: e.target.value });
    this.setState({
      events: [],
    })

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

    //for Activity
    var isActivityChecked = false;
    if (name.indexOf('Activity') >= 0) {
      if (value == 2) {
        isActivityChecked = true;
        this.setState({
          isActivityChecked: true,
        })
      }
      else
        this.setState({
          isActivityChecked: false,
        })
    }
    else
      isActivityChecked = this.state.isActivityChecked;

    if (isActivityChecked)
      this.props.getActivitysByAttacher('*',  this.props.user.email);

    //for Appointment
    var isAppointmentChecked = false;
    if (name.indexOf('Appointment') >= 0) {
      if (value == 2) {
        isAppointmentChecked = true;
        this.setState({
          isAppointmentChecked: true,
        })
      }
      else
        this.setState({
          isAppointmentChecked: false,
        })
    }
    else
      isAppointmentChecked = this.state.isAppointmentChecked;

    if (isAppointmentChecked)
      this.props.getAppointmentsByAttacher('*',  this.props.user.email);

    //for Task
    var isTaskChecked = false;
    if (name.indexOf('Task') >= 0) {
      if (value == 2) {
        isTaskChecked = true;
        this.setState({
          isTaskChecked: true,
        })
      }
      else
        this.setState({
          isTaskChecked: false,
        })
    }
    else
      isTaskChecked = this.state.isTaskChecked;

    if (isTaskChecked)
      this.props.getTasksByAttacher(attacherid, attacherType, this.state.searchTerm,  this.props.user.email);
      
    //for Case
    var isCaseChecked = false;
    if (name.indexOf('Case') >= 0) {
      if (value == 2) {
        isCaseChecked = true;
        this.setState({
          isCaseChecked: true,
        })
      }
      else
        this.setState({
          isCaseChecked: false,
        })
    }
    else
      isCaseChecked = this.state.isCaseChecked;

    if (isCaseChecked)
      this.props.getCases(this.state.searchTerm,  this.props.user.email);
  }

  onDeleteClick(id) {
    this.props.deleteEvent(id);
  }
  onDayClick(date, jsEvent, view) {
    var url = `/add-activity`;
    this.props.history.push(url);
  }
  onEventClick(date, jsEvent, view) {
    const eventid = date.id;
    const eventType = date.eventType;
    const moduleName = date.moduleName;

    var url = `/${moduleName}/${eventid}`;
    this.props.history.push(url);
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

    var eventContent;
    if (loading) {
      eventContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (this.props.events) {
        eventContent = this.props.events.map(event => {
          var linkTo = '';
          linkTo = '/' + getModuleName(event.attacherType) + '/' + event.attacherid;
          return (
            <tr key={event._id}>
              <td><Link to={`/event/${event._id}`}>{event.name}</Link></td>
              <td>{event.eventCategory}</td>
              <td>{formatDate(event.eventDate, '/')}</td>
              <td><Link to={`/staff/${event.user}`}>{event.userName}</Link></td>
              {attacherType != require('../../common/constants').MODULE_ALL ? '' : <td><Link to={linkTo}> {event.attacherType == 0 || event.attacherType == 1 ? '' : event.attacherTag}</Link></td>}
              <td>
                <button
                  onClick={this.onDeleteClick.bind(this, event._id)}
                  className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          );
        });
      }

    }
    return (
      <div id="divCalendar">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <TextFieldGroup
                type='checkbox'
                placeholder="Activity"
                name="chkActivity"
                //checked={taskTodo.status == '2' ? 'checked' : ''}
                value={true}
                onChange={this.onCheckboxChange}
                info="Activity"
              />
            </div>
            <div className="col-2">
              <TextFieldGroup
                type='checkbox'
                placeholder="Appointment"
                name="chkAppointment"
                //checked={taskTodo.status == '2' ? 'checked' : ''}
                value={true}
                onChange={this.onCheckboxChange}
                info="Appointment"
              />
            </div>
            <div className="col-2">
              <TextFieldGroup
                type='checkbox'
                placeholder="Task"
                name="chkTask"
                //checked={taskTodo.status == '2' ? 'checked' : ''}
                value={true}
                onChange={this.onCheckboxChange}
                info="Task"
              />
            </div>
            <div className="col-2">
              <TextFieldGroup
                type='checkbox'
                placeholder="Case"
                name="chkCaset"
                //checked={taskTodo.status == '2' ? 'checked' : ''}
                value={true}
                onChange={this.onCheckboxChange}
                info="Case"
              />
            </div>


          </div>
          <div className="row">
            <FullCalendar
              id="fullCalendar"
              header={{
                left: 'prev,next today myCustomButton',
                center: 'title',
                right: 'month,basicWeek,basicDay'
              }}
              defaultDate={new Date()}
              navLinks={true} // can click day/week names to navigate views
              editable={true}
              eventLimit={true} // allow "more" link when too many events
              events={this.state.events}

              dayClick={this.onDayClick}
              eventClick={this.onEventClick}
            />
          </div>
        </div>
      </div>

    );
  }
}

ListEvent.propTypes = {
  //deleteEvent: PropTypes.func.isRequired,
  //events: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    activitys: state.activity.activitys ? state.activity.activitys : null,
    appointments: state.appointment.appointments ? state.appointment.appointments : null,
    tasks: state.task.tasks ? state.task.tasks : null,
    cases: state.case_.cases ? state.case_.cases : null,
    loading: state.event ? state.event.loading : null,
  };
};

export default connect(mapStateToProps, { getActivitysByAttacher, getAppointmentsByAttacher, getTasksByAttacher, getCases })(
  ListEvent
);
