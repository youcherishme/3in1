const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../../common/util.js");

// Appointment model
const Appointment = require('../../models/Appointment');

// Load Validation
const validateAppointmentInput = require('../../validation/appointment');

// @route   GET api/appointment/test
// @desc    Tests Appointment route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Appointment Works' }));


// @route   GET api/appointment/getAppointmentsByAttacher
// @desc    Get  getAppointmentsByAttacher
// @access  Public
router.get('/getAppointmentsByAttacher/:attacherid/:attacherType/:searchTerm/:userEmail',
  (req, res) => {
    var searchTerm = req.params.searchTerm;
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

    const attacherid = req.params.attacherid;
    const attacherType = req.params.attacherType;
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

      if (attacherType > 1) //ALL ttt
      {
        filter = {
          attacherid: attacherid,
          attacherType: attacherType,
        }
      }

      Appointment.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(appointments => {
          if (!appointments) {
            errors.noappointment = 'There are no appointments';
            console.log(errors.noappointment);
            return res.status(404).json(errors);
          }
          res.json(appointments);
        })
        .catch(err => res.status(404).json({ appointment: 'There are no appointments' }));
    });
  }
);
// @route   GET api/search/:searchTerm
// @desc    Search appointment
// @access  Public
router.get('/search/:searchTerm',
  (req, res) => {
    var searchTerm = req.params.searchTerm;
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;
    console.log(searchTerm);

    var filter = {};
    if (searchTerm != '*') {
      filter = {
        $or: [
          { name: { "$regex": searchTerm, "$options": "i" } },
        ]
      };
    }
    console.log(filter);
    Appointment.find(filter)
      .sort({ 'createdDate': -1 })
      .limit(PAGE_LIMIT)
      .then(appointments => {
        if (!appointments) {
          errors.noappointment = 'There are no appointments';
          console.log(errors.noappointment);
          return res.status(404).json(errors);
        }
        res.json(appointments);
      })
      .catch(err => res.status(404).json({ appointment: 'There are no appointments' }));
  }
);

// @route   GET api/appointment/all
// @desc    Get all appointment
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Appointment.find()
      .then(appointments => {
        if (!appointments) {
          errors.noappointment = 'There are no appointments';
          console.log(errors.noappointment);
          return res.status(404).json(errors);
        }
        res.json(appointments);
      })
      .catch(err => res.status(404).json({ appointment: 'There are no appointments' }));
  }
);


// @route   GET api/appointment/:id/:userEmail
// @desc    Get appointment by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Appointment with userEmail ', userEmail);

  util.connectDatabaseByUserEmail(userEmail, () => {

  Appointment.findById(id)
    .then(appointment => {
      res.json(appointment);
    })
    .catch(err =>
      res.status(404).json({ noappointmentfound: 'No appointment found with that ID' })
    );
  });
});

// @route   POST api/appointment
// @desc    Add appointment 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {
      console.log('Connected to DB with userEmail ', userEmail);

    const { errors, isValid } = validateAppointmentInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    if (id === undefined) {
      //create new appointment
      const newAppointment = new Appointment({
        user: req.body.userid,
        userName: req.body.userName,
        userEmail: req.body.userEmail,

        client: req.body.clientid,
        clientName: req.body.clientName,
        name: req.body.name,
        appointmentDate: req.body.appointmentDate,
        appointmentTime: req.body.appointmentTime,
        description: req.body.description,
        appointmentCategory: req.body.appointmentCategory,
        status: req.body.status,

        attacherid: req.body.attacherid,
        attacherTag: req.body.attacherTag,
        attacherType: req.body.attacherType,

        createdDate: req.body.createdDate,
      });

      console.log(newAppointment);
      newAppointment.save().then(appointment => res.json(appointment));
    }
    else {
      //update appointment
      const appointmentFields = {};
      if (req.body.name)
        appointmentFields.name = req.body.name;
      if (req.body.appointmentDate)
        appointmentFields.appointmentDate = req.body.appointmentDate;
      if (req.body.appointmentTime)
        appointmentFields.appointmentTime = req.body.appointmentTime;
      if (req.body.description)
        appointmentFields.description = req.body.description;
      if (req.body.appointmentCategory)
        appointmentFields.appointmentCategory = req.body.appointmentCategory;
      if (req.body.status)
        appointmentFields.status = req.body.status;

      if (req.body.userid)
        appointmentFields.user = req.body.userid;
      if (req.body.userName)
        appointmentFields.userName = req.body.userName;
      if (req.body.userEmail)
        appointmentFields.userEmail = req.body.userEmail;

      if (req.body.clientid)
        appointmentFields.client = req.body.clientid;
      if (req.body.clientName)
        appointmentFields.clientName = req.body.clientName;

      if (req.body.attacherid)
        appointmentFields.attacherid = req.body.attacherid;
      if (req.body.attacherTag)
        appointmentFields.attacherTag = req.body.attacherTag;
      if (req.body.attacherType)
        appointmentFields.attacherType = req.body.attacherType;

      if (req.body.createdDate)
        appointmentFields.createdDate = req.body.createdDate;

      Appointment.findOneAndUpdate(
        { _id: id },
        { $set: appointmentFields },
        { new: true }
      ).then(appointment => res.json(appointment));

    }
  });
}
);
// @route   DELETE api/appointment/:id
// @desc    Delete appointment
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

      Appointment.findOne(filter)
      .then(appointment => {
        // Delete
        appointment.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ appointmentnotfound: 'No appointment found' }));
  });
});


module.exports = router;