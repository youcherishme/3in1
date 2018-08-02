import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { addDocument ,getDocument, upload } from '../actions/documentActions';

import TextFieldGroup from '../../common/components/controls/TextFieldGroup';
import TextAreaFieldGroup from '../../common/components/controls/TextAreaFieldGroup';
import InputGroup from '../../common/components/controls/InputGroup';
import SelectListGroup from '../../common/components/controls/SelectListGroup';

import _ from "lodash";
import { formatDate } from '../../common/utils/General';

class EditDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      documentDate: '',
      uploadFiles: [],

      userName: '',
      userEmail: '',
      userid: 0,

      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFileUploadDeleteClick = this.onFileUploadDeleteClick.bind(this); 
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const userEmail = this.props.user.email;
    this.props.getDocument(id, userEmail);
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.document) {
      const document = nextProps.document;
      // Set component fields state
      this.setState({
        _id: document._id,
        name: document.name,
        description: document.description,
        documentDate: document.documentDate,

        uploadFiles: document.uploadFiles,

        userid: document.userid,
        userName: document.userName,
        userEmail: document.userEmail,

        attacherid: document.attacherid,
        attacherType: document.attacherType,

      });
    }

  }
  onDocumentTypeSelectChange(event) {
    this.setState(
      {
        documentType: event.target.value,
      });
  }
  onFileUploadDeleteClick(id) {
    //this.props.deleteFileUpload(id);
    alert(id);
  }
  
  onFileUploadDeleteClick__(event) {
      //alert('ttt');
      console.log('ttt');
      var answer = window.confirm('Are you sure to delete this Document? This can NOT be undone!');
      if(!answer)
        return;  
      }

  onSubmit(e) {
    e.preventDefault();
    console.log('onSubmit');
    const documentData = {
      _id: this.state._id,
      name: this.state.name,
      description: this.state.description,
      documentDate: new Date(),

      userid: this.props.user.id,
      userName: this.props.user.name,
      userEmail: this.props.user.email,

      attacherid: this.state.attacherid,
      attacherType: this.state.attacherType,

      uploadFiles: this.state.uploadFiles,

    };

    console.log('onSubmit before addDocument');
    this.props.addDocument(documentData, () => {
      console.log('onSubmit done addDocument');
      this.props.history.goBack();
    });

  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onUploadClick(e) {
    const uploadFile = this.uploadInput.files[0];
    if (uploadFile) {
      const formData = new FormData();
      formData.append('file', uploadFile);
      this.props.upload(formData, (response) => {
        var newUploadFile = {
          uploadFileUrl: response.uploadFileUrl,
          uploadFileName: response.uploadFileName,
          uploadDate: new Date(),
          user: this.props.document.user,
          userName: this.props.document.userName,
        };
        var uploadFiles = this.props.document.uploadFiles;
        uploadFiles.push(newUploadFile);
  
        this.setState({
          uploadFiles: uploadFiles,
        });
  
  
      });
    }
  }
  render() {
    console.log('render');
    const { errors } = this.state;
    var uploadFileRowContent;
    if (this.state.uploadFiles && this.state.uploadFiles.length > 0) {
      uploadFileRowContent = this.state.uploadFiles.map((uploadFile) => (
        <tr key={uploadFile._id}>
          <td><a href={`${uploadFile.uploadFileUrl}`} >{uploadFile.uploadFileName}</a></td>
          <td>{formatDate(uploadFile.uploadDate, '/') }</td>
          <td>{uploadFile.userName}</td>
          <td>
            <input type='button' 
                onClick={ (e) => this.onFileUploadDeleteClick()}
                className="btn btn-danger"
                value='Delete'
                >
              </input>            
          </td>
        </tr>
      ));
    }
    

    var uploadFilesContent =
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
          {uploadFileRowContent}
        </tbody>
        <tfoot>
          <tr>
            <input className="form-control-file"
                    ref={(ref) => { this.uploadInput = ref; }} type="file" />
            <input
              type="button"
              value="Upload"
              onClick={() => this.onUploadClick()}
              className="btn btn-info btn-block mt-4"
            />
            
          </tr>          
        </tfoot>
      </table>

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <button className="btn btn-light" onClick={() => this.props.history.goBack()}>Go Back</button>
              <h1 className="display-4 text-center">Edit Document</h1>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  info="* Name"
                />
                <TextFieldGroup
                  placeholder="* Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="* Description"
                />
                {uploadFilesContent}

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

EditDocument.propTypes = {
  getDocument: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    document: state.document.document,
    loading: state.document.loading,
    uploadFile: state.document.uploadFile,
    errors: state.errors
  };
}

export default connect(mapStateToProps, { getDocument, addDocument, upload })(
  withRouter(EditDocument)
);
