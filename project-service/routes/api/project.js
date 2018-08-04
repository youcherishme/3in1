const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
// Project model
const Project = require('../../models/Project');
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
const validateProjectInput = require('../../validation/project');

// @route   GET api/project/test
// @desc    Tests Project route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Project Works' }));

// @route   GET api/search/:searchTerm
// @desc    Search project
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
      Project.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(projects => {
          if (!projects) {
            errors.noproject = 'There are no projects';
            console.log(errors.noproject);
            return res.status(404).json(errors);
          }
          res.json(projects);
        })
        .catch(err => res.status(404).json({ project: 'There are no projects' }));
    });
  }
);


// @route   GET api/project/all
// @desc    Get all project
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Project.find()
      //.populate('client')
      .then(projects => {
        if (!projects) {
          errors.noproject = 'There are no projects';
          console.log(errors.noproject);
          return res.status(404).json(errors);
        }
        res.json(projects);
      })
      .catch(err => res.status(404).json({ project: 'There are no projects' }));
  });
// @route   GET api/project/:id/:userEmail
// @desc    Get project by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Task with userEmail ', userEmail);

  util.connectDatabaseByUserEmail(userEmail, () => {
  Project.findById(id)
    .then(project => {
      res.json(project);
    }
      //.catch(err => res.status(404).json({ client: 'There are no clients' }));
    )
    .catch(err =>
      res.status(404).json({ noprojectfound: 'No project found with that ID' })
    );
  });
});

// @route   POST api/project
// @desc    Add project 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const { errors, isValid } = validateProjectInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    if (id === undefined) {
      //create new project
      const newProject = new Project({
        client: req.body.clientid,
        clientName: req.body.clientName,
        user: req.body.userid,
        userName: req.body.userName,
        userEmail: req.body.userEmail,

        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,

        createdDate: req.body.createdDate,
      });
      newProject.save().then(project => res.json(project));
    }
    else {
      //update project
      const projectFields = {};

      if (req.body.clientid)
        projectFields.client = req.body.clientid;
      if (req.body.clientName)
        projectFields.clientName = req.body.clientName;

      if (req.body.userid)
        projectFields.user = req.body.userid;
      if (req.body.userName)
        projectFields.userName = req.body.userName;
      if (req.body.userEmail)
        projectFields.userEmail = req.body.userEmail;

      if (req.body.name)
        projectFields.name = req.body.name;
      if (req.body.code)
        projectFields.code = req.body.code;
      if (req.body.description)
        projectFields.description = req.body.description;
      if (req.body.startDate)
        projectFields.startDate = req.body.startDate;
      if (req.body.endDate)
        projectFields.endDate = req.body.endDate;

      if (req.body.createdDate)
        projectFields.createdDate = req.body.createdDate;

      Project.findOneAndUpdate(
        { _id: id },
        { $set: projectFields },
        { new: true }
      ).then(project => {
        //update constrain to Task
        var taskFields = {};
        taskFields.attacherTag = project.code;

        Task.updateMany(
          { attacherid: project._id },
          { $set: taskFields },
          { new: true }
        ).then(task => {
          console.log('update constrain to Task OK');
        })
          .catch(err => console.log(err));

        //update constrain to Quotation
        var quotationFields = {};
        quotationFields.attacherTag = project.code;

        Quotation.updateMany(
          { attacherid: project._id },
          { $set: quotationFields },
          { new: true }
        ).then(quotation => {
          console.log('update constrain to Quotation OK');
        })
          .catch(err => console.log(err));

        //update constrain to Invoice
        var invoiceFields = {};
        invoiceFields.attacherTag = project.code;

        Invoice.updateMany(
          { attacherid: project._id },
          { $set: invoiceFields },
          { new: true }
        ).then(invoice => {
          console.log('update constrain to Invoice OK');
        })
          .catch(err => console.log(err));

        //update constrain to Appointment
        var appointmentFields = {};
        appointmentFields.attacherTag = project.code;

        Appointment.updateMany(
          { attacherid: project._id },
          { $set: appointmentFields },
          { new: true }
        ).then(appointment => {
          console.log('update constrain to Appointment OK');
        })
          .catch(err => console.log(err));

        //return project
        return res.json(project);
      });

    }
  }
);

// @route   DELETE api/project/:id
// @desc    Delete project
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
    Project.findOne(filter)
      .then(project => {
        // Delete
        project.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ projectnotfound: 'No project found' }));
    });
  });
  

module.exports = router;