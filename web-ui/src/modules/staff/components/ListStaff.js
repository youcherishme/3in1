import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getStaffs, deleteStaff } from '../actions/staffActions';
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListStaff extends Component {
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
    this.timer = null;
    this.doSearch();
  }
  onDeleteClick(id) {
    this.props.deleteStaff(id);
  }
  doSearch() {
    console.log('doSearch');
    this.props.getStaffs(this.state.searchTerm);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  render() {
    const { loading } = this.props;

    var staffContent = <tr><td></td></tr>;
    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.staffs) {
        staffContent = this.props.staffs.map(staff => (
          <tr key={staff._id}>
            <td><Link to={`/staff/${staff._id}`}>{staff.code}</Link></td>
            <td>{staff.firstName}</td>
            <td>{staff.lastName}</td>
            <td>{staff.workingPhoneNo}</td>
            <td>{staff.workingEmail}</td>
            <td>{formatDate(staff.createdDate, '-', 'ymd')}</td>
            <td>
              <button
                onClick={this.onDeleteClick.bind(this, staff._id)}
                className="btn-light">
                <i className="fas fa-minus-circle text-info mr-1" />
                Delete
              </button>
            </td>
          </tr>
        ));
      }

    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="mb-4">Staffs</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-staff`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Staff
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
                    <th>Code</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Working Email</th>
                    <th>Working Phone</th>
                    <th>Created Date</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {staffContent}
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

ListStaff.propTypes = {
  deleteStaff: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    staffs: state.staff.staffs ? state.staff.staffs : null,
    loading: state.staff.loading,
  };
};

export default connect(mapStateToProps, { getStaffs, deleteStaff })(
  ListStaff
);
