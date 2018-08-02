import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import { addRepo } from '../actions/repoActions';
import { resetStore } from '../../common/actions/commonActions';
import Spinner from '../../common/components/controls/Spinner';

class AddRepo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      repoCode: '',
      repoConnectionUrl: '',
      companyName: '',
      contactName: '',
      contactEmail: '',
      adminName: '',
      adminEmail: '',
      description: '',
      createdDate: new Date(),

      errors: {},
      disabled: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  onSubmit(e) {
    e.preventDefault();

    const repoData = {
      repoCode: this.state.repoCode,
      repoConnectionUrl: this.state.repoConnectionUrl,
      companyName: this.state.companyName,
      contactName: this.state.contactName,
      contactEmail: this.state.contactEmail,
      adminName: this.state.adminName,
      adminEmail: this.state.adminEmail,
      description: this.state.description,
      createdDate: this.state.createdDate,
    };
    this.props.addRepo(repoData, () => {
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
                <h1 className="display-4 text-center">Add Repo</h1>
                <p className="lead text-center">
                </p>
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="* Repo Code"
                    name="repoCode"
                    value={this.state.repoCode}
                    onChange={this.onChange}
                    error={errors.repoCode}
                    info="* Repo Code"
                  />
                <TextFieldGroup
                  placeholder="* Repo Connection Url"
                  name="repoConnectionUrl"
                  value={this.state.repoConnectionUrl}
                  onChange={this.onChange}
                  error={errors.repoConnectionUrl}
                  info="* Repo Connection Url"
                />
                  
                  <TextFieldGroup
                    placeholder="* Company Name"
                    name="companyName"
                    value={this.state.companyName}
                    onChange={this.onChange}
                    error={errors.companyName}
                    info="* Company Name"
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
                    placeholder="Contact Name"
                    name="contactName"
                    value={this.state.contactName}
                    onChange={this.onChange}
                    error={errors.contactName}
                    info="Contact Name"
                  />
                  <TextFieldGroup
                    placeholder="Contact Email"
                    name="contactEmail"
                    value={this.state.contactEmail}
                    onChange={this.onChange}
                    error={errors.contactEmail}
                    info="Contact Email"
                  />
                  <TextFieldGroup
                    placeholder="Admin Name"
                    name="adminName"
                    value={this.state.adminName}
                    onChange={this.onChange}
                    error={errors.adminName}
                    info="Admin Name"
                  />
                  <TextFieldGroup
                    placeholder="Admin Email"
                    name="adminEmail"
                    value={this.state.adminEmail}
                    onChange={this.onChange}
                    error={errors.adminEmail}
                    info="Admin Email"
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
}

AddRepo.propTypes = {
  addRepo: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    //loading: state.repo.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addRepo, resetStore })(
  withRouter(AddRepo)
);
