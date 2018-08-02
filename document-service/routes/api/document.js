const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");

const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const util = require("../../common/util.js");

// Document model
const Document = require('../../models/Document');

// Load Validation
const validateDocumentInput = require('../../validation/document');

// @route   GET api/document/test
// @desc    Tests Document route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Document Works' }));

// @route   GET api/document/getDocumentsByAttacher
// @desc    Get  getDocumentsByAttacher
// @access  Public
router.get('/getDocumentsByAttacher/:attacherid/:attacherType/:searchTerm/:userEmail',
  (req, res) => {
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

    const attacherid = req.params.attacherid;
    const attacherType = req.params.attacherType;
    const searchTerm = req.params.searchTerm;
    const userEmail = req.params.userEmail;
    util.connectDatabaseByUserEmail(userEmail, (err) => {
      if (err) {
        console.log('Err connectDatabaseByUserEmail ', userEmail, err);
        return res.status(404).json(err);
      }
      console.log('connectDatabaseByUserEmail: Connected to DB with userEmail ', userEmail);

      var filter = {
        $and: [
          { userEmail: userEmail },
        ]
      };

      if (searchTerm != '*') {
        filter = {
          $and: [
            { userEmail: userEmail },
            { name: { "$regex": searchTerm, "$options": "i" } },
          ]
        };
      }
      console.log(attacherid);
      console.log(attacherType);

      if (attacherType > 1) //ALL ttt
      {
        filter = {
          attacherid: attacherid,
          attacherType: attacherType,
        }
      }

      Document.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(documents => {
          if (!documents) {
            errors.nodocument = 'There are no documents';
            console.log(errors.nodocument);
            return res.status(404).json(errors);
          }
          res.json(documents);
        })
        .catch(err => res.status(404).json({ document: 'There are no documents' }));
    });
  }
);
// @route   GET api/document/all
// @desc    Get all document
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Document.find()
      .then(documents => {
        if (!documents) {
          errors.nodocument = 'There are no documents';
          console.log(errors.nodocument);
          return res.status(404).json(errors);
        }
        res.json(documents);
      })
      .catch(err => res.status(404).json({ document: 'There are no documents' }));
  }
);
// @route   GET api/document/:id/:userEmail
// @desc    Get document by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Appointment with userEmail ', userEmail);

  util.connectDatabaseByUserEmail(userEmail, () => {
    Document.findById(id)
      .then(document => {
        res.json(document);
      })
      .catch(err =>
        res.status(404).json({ nodocumentfound: 'No document found with that ID' })
      );
  });
});
// @route   POST api/document
// @desc    Add document 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {
      console.log('Connected to DB with userEmail ', userEmail);

      const { errors, isValid } = validateDocumentInput(req.body);
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }

      if (id === undefined) {
        //create new document
        const newDocument = new Document({
          user: req.body.userid,
          userName: req.body.userName,
          userEmail: req.body.userEmail,

          name: req.body.name,
          documentDate: req.body.documentDate,
          description: req.body.description,
          attacherid: req.body.attacherid,
          attacherType: req.body.attacherType,
          createdDate: req.body.createdDate,

        });
        newDocument.save().then(document => res.json(document));
      }
      else {
        //update document
        const documentFields = {};
        if (req.body.userid)
          documentFields.user = req.body.userid;
        if (req.body.userName)
          documentFields.userName = req.body.userName;
        if (req.body.userEmail)
          documentFields.userEmail = req.body.userEmail;

        if (req.body.name)
          documentFields.name = req.body.name;
        if (req.body.description)
          documentFields.description = req.body.description;

        if (req.body.uploadFiles)
          documentFields.uploadFiles = req.body.uploadFiles;

        if (req.body.documentDate)
          documentFields.documentDate = req.body.documentDate;

        if (req.body.attacherType)
          documentFields.attacherType = req.body.attacherType;
        if (req.body.attacherid)
          documentFields.attacherid = req.body.attacherid;
        if (req.body.createdDate)
          documentFields.createdDate = req.body.createdDate;

        Document.findOneAndUpdate(
          { _id: id },
          { $set: documentFields },
          { new: true }
        ).then(document => res.json(document));

      }
    });
  }
);
// @route   DELETE api/document/:id
// @desc    Delete document
// @access  Private
router.delete(
  '/:id/:userEmail',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.params.id;
    const userEmail = req.params.userEmail;
    console.log('delete with id + userEmail ', id, userEmail);

    util.connectDatabaseByUserEmail(userEmail, () => {
      var filter = {
        $and: [
          { userEmail: userEmail },
          { _id: id },
        ]
      };

      Document.findOne(filter)
      .then(document => {
        // Delete
        document.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ documentnotfound: 'No document found' }));
    });
  });
  

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  try {
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: '3in1bucket',
      ContentType: type,
      Key: name,
    };
    return s3.upload(params).promise();
  }
  catch (err) {
    console.log(err);
  }
};

// @route   GET api/document/upload
// @desc    Tests Document route
// @access  Public
router.post('/upload', (req, res) => {
  console.log('start upload ');

  let imageFile = req.files.file;
  const buffer = imageFile.data;
  console.log(imageFile);
  uploadFile(buffer, imageFile.name, imageFile.mimetype)
    .then(response => {
      console.log('upload Ok ');
      res.json({ uploadFileUrl: response.Location, uploadFileName: response.Key });
    })
    .catch(err => res.status(404).json({ err: err }));
});

module.exports = router;