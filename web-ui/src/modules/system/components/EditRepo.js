import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import isEmpty from '../../common/validation/is-empty';
import { addRepo, getRepo } from '../actions/repoActions';
import { resetStore } from '../../common/actions/commonActions';

class EditRepo extends Component {
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

      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getRepo(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.repo.repo) {
      const repo = nextProps.repo.repo;
      // Set component fields state
      this.setState({
        _id: repo._id,
        repoCode: repo.repoCode,
        repoConnectionUrl: repo.repoConnectionUrl,
        companyName: repo.companyName,
        contactName: repo.contactName,
        contactEmail: repo.contactEmail,
        adminName: repo.adminName,
        adminEmail: repo.adminEmail,
      });
    }
  }
  goBack() {
    this.props.resetStore();
    this.props.history.goBack();
  }

  onSubmit(e) {
    e.preventDefault();

    const repoData = {
      _id: this.state._id,
      repoCode: this.state.repoCode,
      repoConnectionUrl: this.state.repoConnectionUrl,
      companyName: this.state.companyName,
      contactName: this.state.contactName,
      contactEmail: this.state.contactEmail,
      adminName: this.state.adminName,
      adminEmail: this.state.adminEmail,
    };

    this.props.addRepo(repoData, () => {
      this.goBack();
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Repo</h1>
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

EditRepo.propTypes = {
  getRepo: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  repo: state.repo,
  errors: state.errors
});

export default connect(mapStateToProps, { getRepo, addRepo, resetStore })(
  withRouter(EditRepo)
);
