import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCases, deleteCase } from '../actions/caseActions';
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListCase extends Component {
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
    console.log('ListCase componentDidMount');
    this.doSearch();
  }
  doSearch() {
    console.log('doSearch');
    this.props.getCases(this.state.searchTerm,  this.props.user.email);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  onDeleteClick(id) {
    const userEmail = this.props.user.email;
    this.props.deleteCase(id, userEmail);
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
    var caseContent;

    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.cases) {
        caseContent = this.props.cases.map(case_ => (
          <tr key={case_._id}>
            <td><Link to={`/case/${case_._id}`}>{case_.code}</Link></td>
            <td>{case_.name}</td>
            <td>{formatDate(case_.openDate, '/')}</td>
            <td>{formatDate(case_.statuteOfLimitations, '/')}</td>

            <td><Link to={`/client/${case_.client}`}>{case_.clientName}</Link></td>
            <td><Link to={`/case/${case_.user}`}>{case_.userName}</Link></td>
            <td>
              <button
                onClick={this.onDeleteClick.bind(this, case_._id)}
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
              <h2 className="mb-4">Cases</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-case/${attacherid}/${attacherTag}/${attacherType}`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Case
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
                    <th>Name</th>
                    <th>Open Date</th>
                    <th>Statute Of Limitations</th>
                    <th>Client</th>
                    <th>User</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {caseContent}
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

ListCase.propTypes = {
  deleteCase: PropTypes.func.isRequired,
  //cases: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    cases: state.case_.cases ? state.case_.cases : null,
    loading: state.case_.loading,
  };
};

export default connect(mapStateToProps, { getCases, deleteCase })(
  ListCase
);
