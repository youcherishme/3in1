import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';

import { addComment } from '../actions/commentActions';
import Spinner from '../../common/components/controls/Spinner';

class AddComment extends Component {
  constructor(props) {
    super(props);
    const { attacherid, attacherType } = this.props.match.params;
    
    this.state = {
      content: '',
      commentDate: new Date(),
      userName: '',
      userid: 0,
      userEmail: '',

      attacherid: attacherid,
      attacherType: attacherType,

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
    this.setState({
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const commentData = {
      content: this.state.content,
      commentDate: new Date(),
      
      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,

      attacherid: this.state.attacherid,
      attacherType: this.state.attacherType,
      createdDate: this.state.createdDate,
    };

    this.props.addComment(commentData, () => {
      this.props.history.goBack();
    });
  }
  onCommentTypeSelectChange(event) {
    this.setState(
      {
        commentType: event.target.value,
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
                <button className="btn btn-light" onClick={() => this.props.history.goBack()}>Go Back</button>
                <h1 className="display-4 text-center">Add Comment</h1>
                <p className="lead text-center">
                </p>
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
                    value="Submit"
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

AddComment.propTypes = {
  addComment: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    //loading: state.comment.loading,
    errors: state.errors
  };
};

export default connect(mapStateToProps, { addComment })(
  withRouter(AddComment)
);
