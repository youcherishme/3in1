import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getClients, deleteClient } from '../actions/clientActions';
import Spinner from '../../common/components/controls/Spinner';
import TextFieldGroup from '../../common/components/controls/TextFieldGroup';

class ListClient extends Component {
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
    console.log('ListClient componentDidMount');
    this.props.getClients(this.state.searchTerm,  this.props.user.email);
  }

  onDeleteClick(id) {
    const userEmail = this.props.user.email;
    this.props.deleteClient(id, userEmail);
  }
  doSearch() {
    console.log('doSearch');
    this.props.getClients(this.state.searchTerm,  this.props.user.email);
  }

  onChange(e) {
    const WAIT_INTERVAL = 500;
    this.setState({ [e.target.name]: e.target.value });

    clearTimeout(this.timer);
    this.timer = setTimeout(this.doSearch, WAIT_INTERVAL);
  }

  render() {
    const { loading } = this.props;

    var clientContent;

    var staffContent = <tr><td></td></tr>;
    var loadingContent = <span />;

    if (loading) {
      loadingContent = <Spinner />;
    }
    else {
      if (this.props.clients) {
        clientContent = this.props.clients.map(client => (
          <tr key={client._id}>
            <td><Link to={`/client/${client._id}`}>{client.code}</Link></td>
            <td>{client.clientType == 1 ? client.firstName + ' ' + client.lastName : client.name}</td>
            <td>{client.phoneNo}</td>
            <td>{client.clientType == 1 ? 'Individual' : client.clientType == 2 ? 'Business' : '-'}</td>
            <td>
            <button
                onClick={this.onDeleteClick.bind(this, client._id)}
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
              <h1 className="mb-4">Clients</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to="/add-client" className="btn btn-light">
                <i className="fas fa-plus-circle text-info mr-1" />
                Add Client
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
                    <th>Phone No</th>
                    <th>Client type</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {clientContent}
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

ListClient.propTypes = {
  deleteClient: PropTypes.func.isRequired,
  //clients: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  console.log('mapStateToProps  ListClient');

  return {
    user: state.auth.user,
    clients: state.client.clients ? state.client.clients : null,
    loading: state.client.loading,
  };
};

export default connect(mapStateToProps, { getClients, deleteClient })(
  ListClient
);
