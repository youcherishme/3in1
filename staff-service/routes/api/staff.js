const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");

// Staff model
const Staff = require('../../models/Staff');

// Load Validation
const validateStaffInput = require('../../validation/staff');

// @route   GET api/staff/test
// @desc    Tests Staff route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Staff Works' }));

// @route   GET api/search/:searchTerm
// @desc    Search staff
// @access  Public
router.get('/search/:searchTerm',
  (req, res) => {
    var searchTerm = req.params.searchTerm;
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

    var filter = {};
    if (searchTerm != '*') {
      filter = {
        $or: [
          { code: { "$regex": searchTerm, "$options": "i" } },
          { firstName: { "$regex": searchTerm, "$options": "i" } },
          { lastName: { "$regex": searchTerm, "$options": "i" } },
          { personalEmail: { "$regex": searchTerm, "$options": "i" } },
          { homePhoneNo: { "$regex": searchTerm, "$options": "i" } },
        ]
      };
    }
    Staff.find(filter)
      .sort({ 'createdDate': -1 })
      .limit(PAGE_LIMIT)
      .then(staffs => {
        if (!staffs) {
          errors.nostaff = 'There are no staffs';
          console.log(errors.nostaff);
          return res.status(404).json(errors);
        }
        res.json(staffs);
      })
      .catch(err => res.status(404).json({ staff: 'There are no staffs' }));
  }
);

// @route   GET api/staff/all
// @desc    Get all staff
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

    Staff.find()
      .sort({ 'createdDate': -1 })
      .limit(PAGE_LIMIT)
      .then(staffs => {
        if (!staffs) {
          errors.nostaff = 'There are no staffs';
          console.log(errors.nostaff);
          return res.status(404).json(errors);
        }
        res.json(staffs);
      })
      .catch(err => res.status(404).json({ staff: 'There are no staffs' }));
  }
);
// @route   GET api/staff/:id
// @desc    Get staff by id
// @access  Public
router.get('/:id', (req, res) => {
  Staff.findById(req.params.id)
    .then(staff => {
      res.json(staff);
    })
    .catch(err =>
      res.status(404).json({ nostafffound: 'No staff found with that ID' })
    );
});

// @route   POST api/staff
// @desc    Add staff 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;

    const { errors, isValid } = validateStaffInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    if ( id === undefined) {
      //create new staff
      const newStaff = new Staff({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        code: req.body.code,
        personalEmail: req.body.personalEmail,
        workingEmail: req.body.workingEmail,
        homePhoneNo: req.body.homePhoneNo,
        workingPhoneNo: req.body.workingPhoneNo,
        createdDate: req.body.createdDate,
      });
      newStaff.save().then(staff => res.json(staff));
    }
    else {
      //update staff
      const staffFields = {};
      if (req.body.firstName)
        staffFields.firstName = req.body.firstName;
      if (req.body.lastName)
        staffFields.lastName = req.body.lastName;
      if (req.body.personalEmail)
        staffFields.personalEmail = req.body.personalEmail;
      if (req.body.workingEmail)
        staffFields.workingEmail = req.body.workingEmail;
      if (req.body.code)
        staffFields.code = req.body.code;
      if (req.body.homePhoneNo)
        staffFields.homePhoneNo = req.body.homePhoneNo;
      if (req.body.workingPhoneNo)
        staffFields.workingPhoneNo = req.body.workingPhoneNo;
      if (req.body.createdDate)
        staffFields.createdDate = req.body.createdDate;

      Staff.findOneAndUpdate(
        { _id: id },
        { $set: staffFields },
        { new: true }
      ).then(staff => res.json(staff));

    }
  }
);

// @route   DELETE api/staff/:id
// @desc    Delete staff
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.params.id;
    Staff.findById(id)
      .then(staff => {
        // Delete
        staff.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ staffnotfound: 'No staff found' }));
  });


module.exports = router;