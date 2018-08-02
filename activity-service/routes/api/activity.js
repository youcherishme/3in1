const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../../common/util.js");

// Activity model
const Activity = require('../../models/Activity');

// Load Validation
const validateActivityInput = require('../../validation/activity');

// @route   GET api/activity/test
// @desc    Tests Activity route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Activity Works' }));

// @route   GET api/activity/getActivitysByAttacher
// @desc    Get  getActivitysByAttacher
// @access  Public
router.get('/getActivitysByAttacher/:searchTerm/:userEmail',
  (req, res) => {
    var searchTerm = req.params.searchTerm;
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

    const userEmail = req.params.userEmail;
    console.log('getActivitysByAttacher ', searchTerm, userEmail);
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
      console.log('getActivitysByAttacher filter ', filter);

      Activity.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(activitys => {
          if (!activitys) {
            errors.noactivity = 'There are no activitys';
            console.log(errors.noactivity);
            return res.status(404).json(errors);
          }
          res.json(activitys);
        })
        .catch(err => res.status(404).json({ activity: 'There are no activity' }));
    });
  }
);
// @route   GET api/activity/all
// @desc    Get all activity
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Activity.find()
      .then(activitys => {
        if (!activitys) {
          errors.noactivity = 'There are no activitys';
          console.log(errors.noactivity);
          return res.status(404).json(errors);
        }
        res.json(activitys);
      })
      .catch(err => res.status(404).json({ activity: 'There are no activitys' }));
  }
);


// @route   GET api/activity/:id
// @desc    Get activity by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Appointment with userEmail ', userEmail);

  util.connectDatabaseByUserEmail(userEmail, () => {

    Appointment.findById(id)
      .then(activity => {
        res.json(activity);
      })
      .catch(err =>
        res.status(404).json({ noactivityfound: 'No activity found with that ID' })
      );
  });
});

// @route   POST api/activity
// @desc    Add activity 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;

    const { errors, isValid } = validateActivityInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    var userName1 = req.body.userName;
    var userEmail1 = req.body.userEmail;
    console.log('userName1 userEmail1 ', userName1, userEmail1);


    if (id === undefined) {
      //create new activity
      const newActivity = new Activity({
        user: req.body.userid,
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        
        client: req.body.clientid,
        clientName: req.body.clientName,
        name: req.body.name,
        activityStartDate: req.body.activityStartDate,
        activityStartTime: req.body.activityStartTime,
        activityEndDate: req.body.activityEndDate,
        activityEndTime: req.body.activityEndTime,
        description: req.body.description,
        activityCategory: req.body.activityCategory,
        status: req.body.status,
      });

      console.log('newActivity ', newActivity)
      newActivity.save().then(activity => res.json(activity));
    }
    else {
      //update activity
      const activityFields = {};
      if (req.body.name)
        activityFields.name = req.body.name;
      if (req.body.activityStartDate)
        activityFields.activityStartDate = req.body.activityStartDate;
      if (req.body.activityStartTime)
        activityFields.activityStartTime = req.body.activityStartTime;
      if (req.body.activityEndDate)
        activityFields.activityEndDate = req.body.activityEndDate;
      if (req.body.activityEndTime)
        activityFields.activityEndTime = req.body.activityEndTime;
      if (req.body.description)
        activityFields.description = req.body.description;
      if (req.body.activityCategory)
        activityFields.activityCategory = req.body.activityCategory;
      if (req.body.status)
        activityFields.status = req.body.status;

      if (req.body.userid)
        activityFields.user = req.body.userid;
      if (req.body.userName)
        activityFields.userName = req.body.userName;
      if (req.body.userEmail)
        activityFields.userEmail = req.body.userEmail;

      if (req.body.clientid)
        activityFields.client = req.body.clientid;
      if (req.body.clientName)
        activityFields.clientName = req.body.clientName;

      Activity.findOneAndUpdate(
        { _id: id },
        { $set: activityFields },
        { new: true }
      ).then(activity => res.json(activity));

    }
  }
);

// @route   DELETE api/activity/:id
// @desc    Delete activity
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Activity.findById(req.params.id)
      .then(activity => {
        // Delete
        activity.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ activitynotfound: 'No activity found' }));
  });


module.exports = router;