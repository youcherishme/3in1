import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import isEmpty from '../../common/validation/is-empty';
import { addCase, getCase } from '../actions/caseActions';
import { getClients } from '../../client/actions/clientActions';
import { getTasksByAttacher } from '../../task/actions/taskActions';
import { resetStore  } from '../../common/actions/commonActions';
import ListTask from '../../task/components/ListTask';
import ListQuotation from '../../quotation/components/ListQuotation';
import ListAppointment from '../../appointment/components/ListAppointment';
import ListInvoice from '../../invoice/components/ListInvoice';
import ListComment from '../../comment/components/ListComment';
import ListDocument from '../../document/components/ListDocument';
import _ from "lodash";
import { formatDate } from '../../common/utils/General';

class EditCase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      code: '',
      description: '',
      openDate: '',
      statuteOfLimitations: '',

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

  componentDidMount() {
    const { id } = this.props.match.params;

    const userEmail = this.props.user.email;
    this.props.getCase(id, userEmail);
    this.props.getClients('*',  this.props.user.email);

    const MODULE_TYPE = require('../../common/constants').MODULE_CASE;
    this.props.getTasksByAttacher(id, MODULE_TYPE, '*',  this.props.user.email);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.case_) {
      const case_ = nextProps.case_;
      this.setState({
        _id: case_._id,
        name: case_.name,
        code: case_.code,
        description: case_.description,
        openDate: case_.openDate,
        statuteOfLimitations: case_.statuteOfLimitations,

        clientid: case_.client,
        clientName: case_.clientName,

        userid: case_.userid,
        userName: case_.userName,
        userEmail: case_.userEmail,
      });
    }

    if (nextProps.clients) {
      const originalClients = nextProps.clients;
      var clientOptions = _.map(originalClients, function (client) {
        return {
          value: client._id,
          label: client.name,
        }
      });
      this.clientOptions = clientOptions;
    }

  }

  onSubmit(e) {
    e.preventDefault();
    var clientOption = _.find(this.clientOptions, { value: this.state.clientid });
    const caseData = {
      _id: this.state._id,
      name: this.state.name,
      code: this.state.code,
      description: this.state.description,
      openDate: this.state.openDate,
      statuteOfLimitations: this.state.statuteOfLimitations,

      clientid: this.state.clientid,
      clientName: this.state.clientName,

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,      
    };
    this.props.addCase(caseData, () => {
      this.goBack();
    });
  }
  onClientSelectChange(event) {
    this.setState(
      {
        clientid: event.target.value,
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
    const { errors } = this.state;
    const MODULE_TYPE = require('../../common/constants').MODULE_CASE;
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>          
              <h1 className="display-4 text-center">Edit Case</h1>
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
                  placeholder="Open Date"
                  name="openDate"
                  value={formatDate(this.state.openDate, '-', 'ymd') }
                  onChange={this.onChange}
                  error={errors.openDate}
                  info="Open Date"
                />
                <TextFieldGroup
                  type='date'
                  placeholder="Statute Of Limitations"
                  name="statuteOfLimitations"
                  value={formatDate(this.state.statuteOfLimitations, '-', 'ymd') }
                  onChange={this.onChange}
                  error={errors.statuteOfLimitations}
                  info="Statute Of Limitations"
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
              <ListTask attacherid= {`${this.props.match.params.id}`} attacherTag= {`${this.props.case_ ? this.props.case_.code : ''}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListQuotation attacherid= {`${this.props.match.params.id}`} attacherTag= {`${this.props.case_ ? this.props.case_.code : ''}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListInvoice attacherid= {`${this.props.match.params.id}`} attacherTag= {`${this.props.case_ ? this.props.case_.code : ''}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 m-auto">
              <hr/>
              <ListAppointment attacherid= {`${this.props.match.params.id}`} attacherTag= {`${this.props.case_ ? this.props.case_.code : ''}`} attacherType={`${MODULE_TYPE}`}  />
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
              <ListComment attacherid= {`${this.props.match.params.id}`} attacherType={`${MODULE_TYPE}`}  />
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

EditCase.propTypes = {
  getCase: PropTypes.func.isRequired,
  getClients: PropTypes.func.isRequired,
  getTasksByAttacher: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    case_: state.case_.case_,
    clients: state.client.clients,
    tasks: state.task.tasks,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { getCase, addCase, getClients, getTasksByAttacher, resetStore })(
  withRouter(EditCase)
);
