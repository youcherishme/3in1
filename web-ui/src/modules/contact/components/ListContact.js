import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getContactsByClientId, deleteContact } from '../actions/contactActions';
import Spinner from '../../common/components/controls/Spinner';

class ListContact extends Component {
  componentDidMount() {
    console.log('ListContact componentDidMount');
    const clientid = this.props.clientid;
    this.props.getContactsByClientId(clientid);
  }

  onDeleteClick(id) {
    this.props.deleteContact(id);
  }

  render() {
    const {loading} = this.props;

    var contactContent;

    if (loading) {
      contactContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (this.props.contacts) {
        contactContent = this.props.contacts.map(contact => (
          <tr key={contact._id}>
            <td><Link to={`/contact/${contact._id}`}>{contact.firstName}</Link></td>
            <td>{contact.lastName}</td>
            <td>{contact.phoneNo}</td>
            <td>{contact.email}</td>
            <td>
              <button
                onClick={this.onDeleteClick.bind(this, contact._id)}
                className="btn btn-danger">
                Delete
            </button>
            </td>
          </tr>
        ));
      }

    }
    return (
      <div>
        <h2 className="mb-4">Contacts</h2>
        <Link to={`/add-contact/${this.props.clientid}`} className="btn btn-light">
          <i className="fas fa-plus-circle text-info mr-1" />
          Add Contact
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone No</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {contactContent}
          </tbody>
        </table>

      </div>

    );
  }
}

ListContact.propTypes = {
  deleteContact: PropTypes.func.isRequired,
  //contacts: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  console.log('mapStateToProps  ListContact');
  return {
    contacts: state.contact.contacts ? state.contact.contacts : null,
    loading: state.contact.loading,
  };
};

export default connect(mapStateToProps, { getContactsByClientId, deleteContact })(
  ListContact
);
