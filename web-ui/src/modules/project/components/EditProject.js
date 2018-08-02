import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import isEmpty from '../../common/validation/is-empty';
import { addProject, getProject } from '../actions/projectActions';
import { getClients } from '../../client/actions/clientActions';
import { getTasksByAttacher } from '../../task/actions/taskActions';
import { resetStore  } from '../../common/actions/commonActions';
import ListTask from '../../task/components/ListTask';
import ListComment from '../../comment/components/ListComment';
import ListDocument from '../../document/components/ListDocument';
import ListQuotation from '../../quotation/components/ListQuotation';
import ListInvoice from '../../invoice/components/ListInvoice';
import ListAppointment from '../../appointment/components/ListAppointment';
import _ from "lodash";
import { formatDate } from '../../common/utils/General';

class EditProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      code: '',
      description: '',
      startDate: '',
      endDate: '',

      clientName: '',
      clientid: '0',
      
      userName: '',
      userid: 0,
      userEmail: '',

      errors: {},

    };
    this.clientOptions = [];

    this.onClientSelectChange = this.onClientSelectChange.bind(this);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount__() {
    const { id } = this.props.match.params;
    this.props.getProject(id);
    this.props.getClients();

    const MODULE_TYPE = require('../../common/constants').MODULE_PROJECT;
    this.props.getTasksByAttacher(id, MODULE_TYPE);    
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    const userEmail = this.props.user.email;
    this.props.getProject(id, userEmail);
    this.props.getClients('*',  this.props.user.email);

    const MODULE_TYPE = require('../../common/constants').MODULE_CASE;
    this.props.getTasksByAttacher(id, MODULE_TYPE, '*',  this.props.user.email);
  }
  
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.project) {
      const project = nextProps.project;
      this.setState({
        _id: project._id,
        name: project.name,
        code: project.code,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,

        clientid: project.client,
        clientName: project.clientName,

        userid: project.userid,
        userName: project.userName,
        userEmail: project.userEmail,
      });
    }

    if (nextProps.clients) {
      const originalClients = nextProps.clients;
      var clientOptions = _.map(originalClients, function (clientOption) {
        return {
          value: clientOption._id,
          label: clientOption.name,
        }
      });
      this.clientOptions = clientOptions;
    }

  }

  onSubmit(e) {
    e.preventDefault();
    var clientOption = _.find(this.clientOptions, { value: this.state.clientid });

    const projectData = {
      _id: this.state._id,
      name: this.state.name,
      code: this.state.code,
      description: this.state.description,
      startDate: this.state.startDate,
      endDate: this.state.endDate,

      clientid: this.state.clientid,
      clientName: this.state.clientName,

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,
    };
    this.props.addProject(projectData, () => {
      this.goBack();
    });
  }
  onClientSelectChange(event) {
    this.setState(
      {
        clientid: event.target.value,
      });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const MODULE_TYPE = require('../../common/constants').MODULE_PROJECT;
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>            
              <h1 className="display-4 text-center">Edit Project</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>

                <SelectListGroup
                  placeholder="Select Client..."
                  name="client"
                  value={this.state.clientid}
                  onChange={this.onClientSelectChange}
                  options={this.clientOptions}
                  error={errors.client}
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
                <TextFieldGroup
                  placeholder="* Code"
                  name="code"
                  value={this.state.code}
                  onChange={this.onChange}
                  error={errors.code}
                  info="* Code"
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
                  name="startDate"
                  value={formatDate(this.state.startDate, '-', 'ymd') }
                  onChange={this.onChange}
                  error={errors.startDate}
                  info="Start Date"
                />
                <TextFieldGroup
                  type='date'
                  placeholder="End Date"
                  name="endDate"
                  value={formatDate(this.state.endDate, '-', 'ymd') }
                  onChange={this.onChange}
                  error={errors.endDate}
                  info="End Date"
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
              <hr/>
              <ListTask attacherid= {`${this.props.match.params.id}`} attacherTag= {`${this.props.project ? this.props.project.code : ''}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListDocument attacherid= {`${this.props.match.params.id}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListQuotation attacherid= {`${this.props.match.params.id}`} attacherTag= {`${this.props.project ? this.props.project.code : ''}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListInvoice attacherid= {`${this.props.match.params.id}`} attacherTag= {`${this.props.project ? this.props.project.code : ''}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListAppointment attacherid= {`${this.props.match.params.id}`} attacherTag= {`${this.props.project ? this.props.project.code : ''}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListComment attacherid= {`${this.props.match.params.id}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

EditProject.propTypes = {
  getProject: PropTypes.func.isRequired,
  getClients: PropTypes.func.isRequired,
  getTasksByAttacher: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    project: state.project.project,
    clients: state.client.clients,
    tasks: state.task.tasks,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getProject, addProject, getClients, getTasksByAttacher, resetStore })(
  withRouter(EditProject)
);
