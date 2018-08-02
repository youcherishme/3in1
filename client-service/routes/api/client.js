const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../../common/util.js");

// Client model
const Client = require('../../models/Client');

// Load Validation
const validateClientInput = require('../../validation/client');

// @route   GET api/client/test
// @desc    Tests Client route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Client Works' }));

// @route   GET api/search/:searchTerm
// @desc    Search client
// @access  Public
router.get('/search/:searchTerm/:userEmail',
  (req, res) => {
    const searchTerm = req.params.searchTerm;
    const userEmail = req.params.userEmail;

    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;
    util.connectDatabaseByUserEmail(userEmail, (err) => {
      if (err) {
        console.log('Err connectDatabaseByUserEmail ', err);
        return res.status(404).json(err);
      }
      console.log('connectDatabaseByUserEmail: Connected to DB with userEmail ', userEmail);

      var filter = {};
      if (searchTerm != '*') {
        filter = {
          $or: [
            { name: { "$regex": searchTerm, "$options": "i" } },
            { code: { "$regex": searchTerm, "$options": "i" } },
            { firstName: { "$regex": searchTerm, "$options": "i" } },
            { lastName: { "$regex": searchTerm, "$options": "i" } },
            { phoneNo: { "$regex": searchTerm, "$options": "i" } },
          ]
        };
      }

      Client.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(clients => {
          if (!clients) {
            errors.noclient = 'There are no clients';
            console.log(errors.noclient);
            return res.status(404).json(errors);
          }
          res.json(clients);
        })
        .catch(err => res.status(404).json({ client: 'There are no clients' }));
    });
  });

// @route   GET api/client/all
// @desc    Get all client
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Client.find()
      .then(clients => {
        if (!clients) {
          errors.noclient = 'There are no clients';
          console.log(errors.noclient);
          return res.status(404).json(errors);
        }
        res.json(clients);
      })
      .catch(err => res.status(404).json({ client: 'There are no clients' }));
  });

// @route   GET api/client/:id
// @desc    Get client by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Task with userEmail ', userEmail);
  util.connectDatabaseByUserEmail(userEmail, () => {
    Client.findById(id)
      .then(client => {
        res.json(client);
      })
      .catch(err =>
        res.status(404).json({ noclientfound: 'No client found with that ID' })
      );
  });
});

// @route   POST api/client
// @desc    Add client 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {

      const { errors, isValid } = validateClientInput(req.body);
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }

      if (id === undefined) {
        //create new client
        const newClient = new Client({
          user: req.body.userid,
          userName: req.body.userName,
          userEmail: req.body.userEmail,
          description: req.body.description,
          code: req.body.code,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          ssn: req.body.ssn,
          ein: req.body.ein,
          clientType: req.body.clientType,
          name: req.body.clientType == 2 ? req.body.name : req.body.firstName + ' ' + req.body.lastName,
          phoneNo: req.body.phoneNo,
          createdDate: req.body.createdDate,
        });
        newClient.save()
          .then(client => res.json(client))
          .catch(err => res.status(404).json({ clientnotfound: 'Can not create' }));
      }
      else {
        //update client
        const clientFields = {};
        if (req.body.clientType)
          clientFields.clientType = req.body.clientType;
        if (req.body.firstName)
          clientFields.firstName = req.body.firstName;
        if (req.body.lastName)
          clientFields.lastName = req.body.lastName;

        if (req.body.ssn)
          clientFields.ssn = req.body.ssn;
        if (req.body.ein)
          clientFields.ein = req.body.ein;

        if (req.body.description)
          clientFields.description = req.body.description;
        if (req.body.code)
          clientFields.code = req.body.code;
        if (req.body.phoneNo)
          clientFields.phoneNo = req.body.phoneNo;
        if (req.body.createdDate)
          clientFields.createdDate = req.body.createdDate;

        if (req.body.userid)
          clientFields.user = req.body.userid;
        if (req.body.userName)
          clientFields.userName = req.body.userName;
        if (req.body.userEmail)
          clientFields.userEmail = req.body.userEmail;

        clientFields.name = clientFields.clientType == 2 ? req.body.name : req.body.firstName + ' ' + req.body.lastName;


        Client.findOneAndUpdate(
          { _id: id },
          { $set: clientFields },
          { new: true }
        ).then(client => res.json(client));
      }
    });
  }
);

// @route   DELETE api/client/:id
// @desc    Delete client
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

      console.log('delete with filter ', filter);
      Client.findOne(filter)
        .then(client => {
          // Delete
          console.log('found ', client);
          client.remove().then(() => res.json({ success: true }));
        })
        .catch(err => {
          console.log('not found ', err);
          res.status(404).json({ clientnotfound: 'No client found' });
        }
        );
    });
  });

module.exports = router;