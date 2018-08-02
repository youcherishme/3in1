import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getQuotationsByAttacher, deleteQuotation } from '../actions/quotationActions';
import Spinner from '../../common/components/controls/Spinner';
import { formatDate, getModuleName } from '../../common/utils/General';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListQuotation extends Component {
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
    console.log('ListTask componentDidMount');

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
    this.doSearch();
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
    this.props.getQuotationsByAttacher(attacherid, attacherType, this.state.searchTerm,  this.props.user.email);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  onDeleteClick(id) {
    const userEmail = this.props.user.email;
    this.props.deleteQuotation(id, userEmail);
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

    var quotationContent = <tr><td></td></tr>;
    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.quotations) {
        quotationContent = this.props.quotations.map(quotation => {
          var linkTo = '';
          linkTo = '/' + getModuleName(quotation.attacherType) + '/' + quotation.attacherid;
          return (
            <tr key={quotation._id}>
              <td><Link to={`/quotation/${quotation._id}`}>{quotation.quotationNo}</Link></td>
              <td>{formatDate(quotation.quotationDate, '/')}</td>
              <td>{formatDate(quotation.dueDate, '/')}</td>
              <td><Link to={`/client/${quotation.client}`}>{quotation.clientName}</Link></td>
              <td><Link to={`/case/${quotation.user}`}>{quotation.userName}</Link></td>
              {attacherType != require('../../common/constants').MODULE_ALL ? '' : <td><Link to={linkTo}> {quotation.attacherType != 0 ? quotation.attacherTag : ''}</Link></td>}
              <td>
                <button
                  onClick={this.onDeleteClick.bind(this, quotation._id)}
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
              <h1 className="mb-4">Quotations</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={`/add-quotation/${attacherid}/${attacherTag}/${attacherType}`} className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Quotation
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
                    <th>Quotation No</th>
                    <th>Quotation Date</th>
                    <th>Due Date</th>
                    <th>Client</th>
                    <th>User</th>
                    {attacherType != require('../../common/constants').MODULE_ALL ? '' : <th>Link to</th>}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {quotationContent}
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

ListQuotation.propTypes = {
  deleteQuotation: PropTypes.func.isRequired,
  //quotations: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    quotations: state.quotation.quotations ? state.quotation.quotations : null,
    loading: state.quotation.loading,
  };
};

export default connect(mapStateToProps, { getQuotationsByAttacher, deleteQuotation })(
  ListQuotation
);
