import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDocumentsByAttacher, deleteDocument } from '../actions/documentActions';
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';

class ListDocument extends Component {
  componentDidMount() {
    const attacherid = this.props.attacherid;
    const attacherType = this.props.attacherType;

    this.props.getDocumentsByAttacher(attacherid, attacherType, '*', this.props.user.email);
  }

  onDeleteClick(id) {
    const userEmail = this.props.user.email;
    this.props.deleteDocument(id, userEmail);
  }

  render() {
    const { loading } = this.props;

    var documentContent;

    if (loading) {
      documentContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (this.props.documents) {
        documentContent = this.props.documents.map(document => (
          <tr key={document._id}>
            <td><Link to={`/document/${document._id}`}>{document.name}</Link></td>
            <td>{formatDate(document.documentDate, '/')}</td>
            <td><Link to={`/staff/${document.user}`}>{document.userName}</Link></td>
            <td>
              <button
                onClick={this.onDeleteClick.bind(this, document._id)}
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
        <h1 className="mb-4">Documents</h1>
        <Link to={`/add-document/${this.props.attacherid}/${this.props.attacherType}`} className="btn btn-light">
          <i className="fas fa-plus-circle text-info mr-1" />
          Add Document
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>User</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {documentContent}
          </tbody>
        </table>

      </div>

    );
  }
}

ListDocument.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  //documents: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    documents: state.document.documents ? state.document.documents : null,
    loading: state.document.loading,
  };
};

export default connect(mapStateToProps, { getDocumentsByAttacher, deleteDocument })(
  ListDocument
);
