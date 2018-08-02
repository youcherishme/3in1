const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../../common/util.js");

// Contact model
const Contact = require('../../models/Contact');

// Load Validation
const validateContactInput = require('../../validation/contact');

// @route   GET api/contact/test
// @desc    Tests Contact route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Contact Works' }));

// @route   GET api/contact/getContactsByClientId
// @desc    Get  getContactsByClientId
// @access  Public
router.get('/getContactsByClientId/:clientid',
  (req, res) => {
    const errors = {};
    const clientid = req.params.clientid;
    Contact.find({ client: clientid })
      .then(contacts => {
        if (!contacts) {
          errors.nocontact = 'There are no contacts';
          return res.status(404).json(errors);
        }
        res.json(contacts);
      })
      .catch(err => res.status(404).json({ contact: 'There are no contacts' }));
  }
);

// @route   GET api/contact/all
// @desc    Get all contact
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Contact.find()
      .then(contacts => {
        if (!contacts) {
          errors.nocontact = 'There are no contacts';
          console.log(errors.nocontact);
          return res.status(404).json(errors);
        }
        res.json(contacts);
      })
      .catch(err => res.status(404).json({ contact: 'There are no contacts' }));
  }
);
// @route   GET api/contact/:id
// @desc    Get contact by id
// @access  Public
router.get('/:id', (req, res) => {
  Contact.findById(req.params.id)
    .then(contact => {
      res.json(contact);
    })
    .catch(err =>
      res.status(404).json({ nocontactfound: 'No contact found with that ID' })
    );
});

// @route   POST api/contact
// @desc    Add contact 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;

    const { errors, isValid } = validateContactInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    if ( id === undefined) {
      //create new contact
      const newContact = new Contact({
        client: req.body.clientid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        createdDate: req.body.createdDate,
      });
      newContact.save().then(contact => res.json(contact));
    }
    else {
      //update contact
      const contactFields = {};
      if (req.body.firstName)
        contactFields.firstName = req.body.firstName;
      if (req.body.lastName)
        contactFields.lastName = req.body.lastName;
      if (req.body.email)
        contactFields.email = req.body.email;
      if (req.body.phoneNo)
        contactFields.phoneNo = req.body.phoneNo;
      if (req.body.createdDate)
        contactFields.createdDate = req.body.createdDate;

      Contact.findOneAndUpdate(
        { _id: id },
        { $set: contactFields },
        { new: true }
      ).then(contact => res.json(contact));

    }
  }
);

// @route   DELETE api/contact/:id
// @desc    Delete contact
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Contact.findById(req.params.id)
      .then(contact => {
        // Delete
        contact.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ contactnotfound: 'No contact found' }));
  });


module.exports = router;