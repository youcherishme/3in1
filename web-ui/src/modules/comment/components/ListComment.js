import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCommentsByAttacher, deleteComment } from '../actions/commentActions';
import Spinner from '../../common/components/controls/Spinner';
import { formatDate } from '../../common/utils/General';

class ListComment extends Component {
  componentDidMount() {
    console.log('ListComment componentDidMount');
    const attacherid = this.props.attacherid;
    const attacherType = this.props.attacherType;

    this.props.getCommentsByAttacher(attacherid, attacherType, '*',  this.props.user.email);
  }

  onDeleteClick(id) {
    const userEmail = this.props.user.email;
    this.props.deleteComment(id, userEmail);
  }

  render() {
    const {loading} = this.props;

    var commentContent;

    if (loading) {
      commentContent = <tr><td><Spinner /></td></tr>;
    }
    else {
      if (this.props.comments) {
        commentContent = this.props.comments.map(comment => (
          <tr key={comment._id}>
            <td><Link to={`/comment/${comment._id}`}>{comment.content}</Link></td>
            <td>{formatDate(comment.commentDate, '/') }</td>
            <td><Link to={`/staff/${comment.user}`}>{comment.userName}</Link></td>
            <td>
              <button
                  onClick={this.onDeleteClick.bind(this, comment._id)}
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
        <h1 className="mb-4">Comments</h1>
        <Link to={`/add-comment/${this.props.attacherid}/${this.props.attacherType}`} className="btn btn-light">
          <i className="fas fa-plus-circle text-info mr-1" />
          Add Comment
        </Link>
        <table className="table">
          <thead>
            <tr>
              <th>Content</th>
              <th>Date</th>
              <th>User</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {commentContent}
          </tbody>
        </table>

      </div>

    );
  }
}

ListComment.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  //comments: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  console.log('mapStateToProps  ListComment');

  return {
    user: state.auth.user,
    comments: state.comment.comments ? state.comment.comments : null,
    loading: state.comment.loading,
  };
};

export default connect(mapStateToProps, { getCommentsByAttacher, deleteComment })(
  ListComment
);
