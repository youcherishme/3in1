import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';
import AutoSuggestFieldGroup from '../../common/components/controls/AutoSuggestFieldGroup';
import { getClients } from '../../client/actions/clientActions';
import { resetStore  } from '../../common/actions/commonActions';
import { CATEGORY_OPTIONS } from '../../common/commonSets';

import Spinner from '../../common/components/controls/Spinner';

import { addAppointment } from '../actions/appointmentActions';

import _ from "lodash";
import { formatDate } from '../../common/utils/General';
import TimePicker from 'react-time-picker';

//import Select from 'react-select';
//import 'react-select/dist/react-select.css';

class AddAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: ''
    }

    const { attacherid, attacherTag, attacherType } = this.props.match.params;
    this.state = {
      userName: '',
      userid: 0,
      userEmail: '',

      attacherid: attacherid,
      attacherTag: attacherTag,
      attacherType: attacherType,

      name: '',
      appointmentCategory: '',
      description: '',
      appointmentDate: new Date(),
      appointmentTime: '10:00',

      clientid: '0',
      clientName: '',

      createdDate: new Date(),

      errors: {},
      disabled: false
    };

    this.clientOptions = [];
    this.handleClientChange = this.handleClientChange.bind(this);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    const userEmail = this.props.user.email;
    this.props.getClients('*',  this.props.user.email);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.clients) {
      const originalClients = nextProps.clients;
      var clientOptions = _.map(originalClients, function (client) {
        const clientOption = {
          id: client._id,
          name: client.name,
          code: client.code,
          phoneNo: client.phoneNo,

          value: client._id,
          label: client.name,
        }
        return clientOption;
      });
      this.clientOptions = clientOptions;

      //set default to first item
      this.setState(
        {
          clientid: this.clientOptions && this.clientOptions.length > 0 ? this.clientOptions[0].value : this.state.clientid,
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
    var clientOption = _.find(this.clientOptions, { value: this.state.clientid });

    const appointmentData = {
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,

      attacherid: this.state.attacherid,
      attacherTag: this.state.attacherTag,
      attacherType: this.state.attacherType,

      name: this.state.name,
      appointmentCategory: this.state.appointmentCategory,
      description: this.state.description,
      appointmentDate: this.state.appointmentDate,
      appointmentTime: this.state.appointmentTime,

      clientid: this.state.clientid,
      clientName: this.state.clientName,

      createdDate: this.state.createdDate,
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
    const { errors, loading } = this.props;
    const categoryOptions = CATEGORY_OPTIONS

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
                <h1 className="display-4 text-center">Add Appointment</h1>
                <p className="lead text-center">
                </p>
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit}>
                  <AutoSuggestFieldGroup
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

AddAppointment.propTypes = {
  getClients: PropTypes.func.isRequired,
  addAppointment: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    clients: state.client.clients,
    //loading: state.appointment.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addAppointment, getClients, resetStore })(
  withRouter(AddAppointment)
);
