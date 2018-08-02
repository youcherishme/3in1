const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../../common/util.js");

// Quotation model
const Quotation = require('../../models/Quotation');

// Load Validation
const validateQuotationInput = require('../../validation/quotation');

// @route   GET api/quotation/test
// @desc    Tests Quotation route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Quotation Works' }));

// @route   GET getQuotationsByAttacher/:attacherid/:attacherType/:searchTerm
// @desc    Search quotation
// @access  Public
router.get('/getQuotationsByAttacher/:attacherid/:attacherType/:searchTerm/:userEmail',
  (req, res) => {
    const errors = {};
    const attacherid = req.params.attacherid;
    const attacherType = req.params.attacherType;
    const searchTerm = req.params.searchTerm;
    const userEmail = req.params.userEmail;

    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

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
            { quotationNo: { "$regex": searchTerm, "$options": "i" } },
          ]
        };
      }

      if (attacherType != 1) //ALL ttt
      {
        filter.attacherid = attacherid;
        filter.attacherType = attacherType;
      }

      Quotation.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(quotations => {
          if (!quotations) {
            errors.noquotation = 'There are no quotations';
            console.log(errors.noquotation);
            return res.status(404).json(errors);
          }
          res.json(quotations);
        })
        .catch(err => res.status(404).json({ quotation: 'There are no quotations' }));
    });
  }
);

// @route   GET api/quotation/all
// @desc    Get all quotation
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Quotation.find()
      .then(quotations => {
        if (!quotations) {
          errors.noquotation = 'There are no quotations';
          console.log(errors.noquotation);
          return res.status(404).json(errors);
        }
        res.json(quotations);
      })
      .catch(err => res.status(404).json({ quotation: 'There are no quotations' }));
  }
);

// @route   GET api/quotation/:id/:userEmail
// @desc    Get quotation by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get quotation with userEmail ', userEmail);

  util.connectDatabaseByUserEmail(userEmail, () => {
    Quotation.findById(id)
    .then(quotation => {
      res.json(quotation);
    })
    .catch(err =>
      res.status(404).json({ noquotationfound: 'No quotation found with that ID' })
    );
  });
});

// @route   POST api/quotation
// @desc    Add quotation 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {
      console.log('Connected to DB with userEmail ', userEmail);

      const { errors, isValid } = validateQuotationInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    if (typeof id === 'undefined') {
      //create new quotation
      const newQuotation = new Quotation({
        quotationNo: req.body.quotationNo,
        quotationDate: req.body.quotationDate,
        description: req.body.description,
        termsConditions: req.body.termsConditions,
        dueDate: req.body.dueDate,

        client: req.body.clientid,
        clientName: req.body.clientName,

        user: req.body.userid,
        userName: req.body.userName,
        userEmail: req.body.userEmail,

        attacherid: req.body.attacherid,
        attacherTag: req.body.attacherTag,
        attacherType: req.body.attacherType,
        createdDate: req.body.createdDate,

      });

      console.log(newQuotation);
      newQuotation.save().then(quotation => res.json(quotation));
    }
    else {
      //update 
      const quotationFields = {};
      if (req.body.quotationNo)
        quotationFields.quotationNo = req.body.quotationNo;
      if (req.body.quotationDate)
        quotationFields.quotationDate = req.body.quotationDate;
      if (req.body.description)
        quotationFields.description = req.body.description;
      if (req.body.termsConditions)
        quotationFields.termsConditions = req.body.termsConditions;
      if (req.body.dueDate)
        quotationFields.dueDate = req.body.dueDate;

      if (req.body.clientid)
        quotationFields.client = req.body.clientid;
      if (req.body.clientName)
        quotationFields.clientName = req.body.clientName;

      if (req.body.userid)
        quotationFields.user = req.body.userid;
      if (req.body.userName)
        quotationFields.userName = req.body.userName;
      if (req.body.userEmail)
        quotationFields.userEmail = req.body.userEmail;

      if (req.body.attacherid)
        quotationFields.attacherid = req.body.attacherid;
      if (req.body.attacherTag)
        quotationFields.attacherTag = req.body.attacherTag;
      if (req.body.attacherType)
        quotationFields.attacherType = req.body.attacherType;

      if (req.body.quotationItems)
        quotationFields.quotationItems = req.body.quotationItems;
      if (req.body.createdDate)
        quotationFields.createdDate = req.body.createdDate;

      console.log(quotationFields);
      Quotation.findOneAndUpdate(
        { _id: id },
        { $set: quotationFields },
        { new: true }
      ).then(quotation => {
        console.log('ttt 666 ');
        res.json(quotation);
      })
        .catch(err => {
          console.log('ttt 555 ');
          res.status(404).json({ quotationError: 'quotation saved err' + err })
        });
      }
    }
    );
  }
);
// @route   DELETE api/quotation/:id
// @desc    Delete quotation
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

      Quotation.findOne(filter)
      .then(quotation => {
        // Delete
        quotation.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ quotationnotfound: 'No quotation found' }));
    });
  });



module.exports = router;