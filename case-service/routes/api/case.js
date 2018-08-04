const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
// Case model
const Case = require('../../models/Case');
// Task model
const Task = require('../../models/Task');
// Quotation model
const Quotation = require('../../models/Quotation');
// Invoice model
const Invoice = require('../../models/Invoice');
// Appointment model
const Appointment = require('../../models/Appointment');
const util = require("../../common/util.js");


// Load Validation
const validateCaseInput = require('../../validation/case');

// @route   GET api/case/test
// @desc    Tests Case route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Case Works' }));

// @route   GET api/search/:searchTerm
// @desc    Search case
// @access  Public
router.get('/search/:searchTerm/:userEmail',
  (req, res) => {
    const searchTerm = req.params.searchTerm;
    const userEmail = req.params.userEmail;
    const errors = {};
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
            {
              $or: [
                { name: { "$regex": searchTerm, "$options": "i" } },
                { code: { "$regex": searchTerm, "$options": "i" } },
                { description: { "$regex": searchTerm, "$options": "i" } },
              ]
            },
          ]
        };
      }

      console.log(searchTerm);
      console.log(filter);
      Case.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(cases => {
          if (!cases) {
            errors.nocase = 'There are no cases';
            console.log(errors.nocase);
            return res.status(404).json(errors);
          }
          res.json(cases);
        })
        .catch(err => res.status(404).json({ case: 'There are no cases' }));
    });
  }
);


// @route   GET api/case/all
// @desc    Get all case
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Case.find()
      //.populate('client')
      .then(cases => {
        if (!cases) {
          errors.nocase = 'There are no cases';
          console.log(errors.nocase);
          return res.status(404).json(errors);
        }
        res.json(cases);
      })
      .catch(err => res.status(404).json({ case: 'There are no cases' }));
  });
// @route   GET api/case/:id:userEmail
// @desc    Get case by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Task with userEmail ', userEmail);

  util.connectDatabaseByUserEmail(userEmail, () => {
  
  Case.findById(id)
    .then(case_ => {
      res.json(case_);
    }
      //.catch(err => res.status(404).json({ client: 'There are no clients' }));
    )
    .catch(err =>
      res.status(404).json({ nocasefound: 'No case found with that ID' })
    );
  });
});

// @route   POST api/case
// @desc    Add case 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const { errors, isValid } = validateCaseInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    if (id === undefined) {
      //create new case
      const newCase = new Case({
        client: req.body.clientid,
        clientName: req.body.clientName,
        user: req.body.userid,
        userName: req.body.userName,
        userEmail: req.body.userEmail,

        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        openDate: req.body.openDate,
        statuteOfLimitations: req.body.statuteOfLimitations,

        createdDate: req.body.createdDate,
      });
      newCase.save().then(case_ => res.json(case_));
    }
    else {
      //update case
      const caseFields = {};

      if (req.body.clientid)
        caseFields.client = req.body.clientid;
      if (req.body.clientName)
        caseFields.clientName = req.body.clientName;

      if (req.body.userid)
        caseFields.user = req.body.userid;
      if (req.body.userName)
        caseFields.userName = req.body.userName;
      if (req.body.userEmail)
        caseFields.userEmail = req.body.userEmail;

      if (req.body.name)
        caseFields.name = req.body.name;
      if (req.body.code)
        caseFields.code = req.body.code;
      if (req.body.description)
        caseFields.description = req.body.description;
      if (req.body.openDate)
        caseFields.openDate = req.body.openDate;
      if (req.body.statuteOfLimitations)
        caseFields.statuteOfLimitations = req.body.statuteOfLimitations;

      if (req.body.createdDate)
        caseFields.createdDate = req.body.createdDate;

      Case.findOneAndUpdate(
        { _id: id },
        { $set: caseFields },
        { new: true }
      ).then(case_ => {
        //update constrain to Task
        var taskFields = {};
        taskFields.attacherTag = case_.code;

        Task.updateMany(
          { attacherid: case_._id },
          { $set: taskFields },
          { new: true }
        ).then(task => {
          console.log('update constrain to Task OK');
        })
          .catch(err => console.log(err));

        //update constrain to Quotation
        var quotationFields = {};
        quotationFields.attacherTag = case_.code;

        Quotation.updateMany(
          { attacherid: case_._id },
          { $set: quotationFields },
          { new: true }
        ).then(quotation => {
          console.log('update constrain to Quotation OK');
        })
          .catch(err => console.log(err));

        //update constrain to Invoice
        var invoiceFields = {};
        invoiceFields.attacherTag = case_.code;

        Invoice.updateMany(
          { attacherid: case_._id },
          { $set: invoiceFields },
          { new: true }
        ).then(invoice => {
          console.log('update constrain to Invoice OK');
        })
          .catch(err => console.log(err));

        //update constrain to Appointment
        var appointmentFields = {};
        appointmentFields.attacherTag = case_.code;

        Appointment.updateMany(
          { attacherid: case_._id },
          { $set: appointmentFields },
          { new: true }
        ).then(appointment => {
          console.log('update constrain to Appointment OK');
        })
          .catch(err => console.log(err));


        return res.json(case_);
      });
    }
  }
);

// @route   DELETE api/case/:id
// @desc    Delete case
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
    Case.findOne(filter)
      .then(case_ => {
        // Delete
        case_.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ casenotfound: 'No case found' }));
    });
});


module.exports = router;