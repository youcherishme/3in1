import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';

import isEmpty from '../../common/validation/is-empty';
import { addComment, getComment } from '../actions/commentActions';

class EditComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      commentDate: '',
      
      userName: '',
      userid: 0,
      userEmail: '',

      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getComment(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.comment) {
      const comment = nextProps.comment;
      // Set component fields state
      this.setState({
        _id: comment._id,
        content: comment.content,
        commentDate: comment.commentDate,

        userid: comment.userid,
        userName: comment.userName,
        userEmail: comment.userEmail,
          
        attacherid: comment.attacherid,
        attacherType: comment.attacherType,
      });
    }
    
  }
  onCommentTypeSelectChange(event) {
    this.setState(
      {
        commentType: event.target.value,
      });
  }

  onSubmit(e) {
    e.preventDefault();
    const commentData = {
      _id: this.state._id,
      content: this.state.content,
      commentDate: new Date(),

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,

      attacherid: this.state.attacherid,
      attacherType: this.state.attacherType,
    };
    this.props.addComment(commentData, () => {
      this.props.history.goBack();
    });

  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const commentTypeOptions = [
      { label: 'Individual', value: 1 },
      { label: 'Business', value: 2 },
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.props.history.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Comment</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Content"
                  name="content"
                  value={this.state.content}
                  onChange={this.onChange}
                  error={errors.content}
                  info="* Content"
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

EditComment.propTypes = {
  getComment: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    comment: state.comment.comment,
    errors: state.errors
  };
}

export default connect(mapStateToProps, { getComment, addComment })(
  withRouter(EditComment)
);
