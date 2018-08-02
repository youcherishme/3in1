import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addCase } from '../actions/caseActions';
import { resetStore  } from '../../common/actions/commonActions';
import Spinner from '../../common/components/controls/Spinner';
import { getClients } from '../../client/actions/clientActions';
import _ from "lodash";
import { formatDate } from '../../common/utils/General';

class AddCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientid: '0',
      clientName: '',
      userName: '',
      userid: 0,
      userEmail: '',

      name: '',
      code: '',
      description: '',
      openDate: new Date(),
      statuteOfLimitations: new Date(),

      createdDate: new Date(),
      
      errors: {},
      disabled: false
    };

    this.clientOptions = [];

    this.onClientSelectChange = this.onClientSelectChange.bind(this);
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
      var clientOptions = _.map(originalClients, function (clientOption) {
        return {
          value: clientOption._id,
          label: clientOption.name,
        }
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

  onSubmit(e) {
    e.preventDefault();

    var clientOption = _.find(this.clientOptions, { value: this.state.clientid });

    const caseData = {
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

      createdDate: this.state.createdDate,
    };
    this.props.addCase(caseData, () => {
      this.goBack();
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

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
                <h1 className="display-4 text-center">Add Case</h1>
                <p className="lead text-center">
                </p>
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit}>
                  <SelectListGroup
                    placeholder="* Select Client..."
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
                    onChange={this.onChange}
                    value={formatDate(this.state.statuteOfLimitations, '-', 'ymd') }
                    info="Statute Of Limitations"
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

AddCase.propTypes = {
  getClients: PropTypes.func.isRequired,
  addCase: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    clients: state.client.clients,
    //loading: state.case_.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addCase, getClients, resetStore  })(
  withRouter(AddCase)
);
