const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require("../../common/util.js");

// Repo model
const Repo = require('../../models/Repo');
const RepoUser = require('../../models/RepoUser');

// Load Validation
const validateRepoInput = require('../../validation/repo');
const validateRepoUserInput = require('../../validation/repoUser');

// @route   GET api/repo/test
// @desc    Tests Repo route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Repo Works' }));

// @route   GET api/repo/search/:searchTerm
// @desc    Search repo
// @access  Public
router.get('/search/:searchTerm',
  (req, res) => {
    var searchTerm = req.params.searchTerm;
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;
    console.log('search searchTerm=', searchTerm);
    util.connectSysDatabase();

    var filter = {};
    if (searchTerm != '*') {
      filter = {
        $or: [
          { repoCode: { "$regex": searchTerm, "$options": "i" } },
          { companyName: { "$regex": searchTerm, "$options": "i" } },
          { contactName: { "$regex": searchTerm, "$options": "i" } },
          { contactEmail: { "$regex": searchTerm, "$options": "i" } },
          { description: { "$regex": searchTerm, "$options": "i" } },
        ]
      };
    }
    Repo.find(filter)
      .sort({ 'createdDate': -1 })
      .limit(PAGE_LIMIT)
      .then(repos => {
        if (!repos) {
          errors.norepo = 'There are no repos';
          console.log(errors.norepo);
          return res.status(404).json(errors);
        }
        res.json(repos);
      })
      .catch(err => res.status(404).json({ repo: 'There are no repos' }));
  }
);


// @route   GET api/repo/all
// @desc    Get all repo
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

    Repo.find()
      .sort({ 'createdDate': -1 })
      .limit(PAGE_LIMIT)
      .then(repos => {
        if (!repos) {
          errors.norepo = 'There are no repos';
          console.log(errors.norepo);
          return res.status(404).json(errors);
        }
        res.json(repos);
      })
      .catch(err => res.status(404).json({ repo: 'There are no repos' }));
  }
);
// @route   GET api/repo/:id
// @desc    Get repo by id
// @access  Public
router.get('/:id', (req, res) => {
  Repo.findById(req.params.id)
    .then(repo => {
      res.json(repo);
    })
    .catch(err =>
      res.status(404).json({ norepofound: 'No repo found with that ID' })
    );
});

// @route   GET api/repo/findRepoOfEmail/:email
// @desc    Get repo by email
// @access  Public
router.get('/findRepoOfEmail/:email', (req, res) => {
  const email = req.params.email;
  console.log('Email ', email);
  Repo.find().elemMatch("repoUsers", { "userEmail": email })
    .then(repos => {
      if (!repos) {
        errors.norepo = 'There are no repos';
        console.log(errors.norepo);
        return res.status(404).json(errors);
      }
      console.log(repos);
      if (repos.length > 0) {
        const repo = repos[0];
        res.json(repo);
      }
    })
    .catch(err => res.status(404).json({ repo: 'There are no repos' }));
});
// @route   POST api/repo
// @desc    Add repo 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;

    const { errors, isValid } = validateRepoInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    if (id === undefined) {
      //create new repo
      const newRepo = new Repo({
        repoCode: req.body.repoCode,
        repoConnectionUrl: req.body.repoConnectionUrl,
        companyName: req.body.companyName,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        adminName: req.body.adminName,
        adminEmail: req.body.adminEmail,
        adminPassword: req.body.adminPassword,
        description: req.body.description,
        createdDate: req.body.createdDate,
      });
      newRepo.save().then(repo => res.json(repo));
    }
    else {
      //update repo
      const repoFields = {};

      if (req.body.repoCode)
        repoFields.repoCode = req.body.repoCode;
      if (req.body.repoConnectionUrl)
        repoFields.repoConnectionUrl = req.body.repoConnectionUrl;
      if (req.body.companyName)
        repoFields.companyName = req.body.companyName;
      if (req.body.contactName)
        repoFields.contactName = req.body.contactName;
      if (req.body.contactEmail)
        repoFields.contactEmail = req.body.contactEmail;
      if (req.body.adminName)
        repoFields.adminName = req.body.adminName;
      if (req.body.adminEmail)
        repoFields.adminEmail = req.body.adminEmail;
      if (req.body.description)
        repoFields.description = req.body.description;
      if (req.body.createdDate)
        repoFields.createdDate = req.body.createdDate;

      if (req.body.repoUsers)
        repoFields.repoUsers = req.body.repoUsers;
      if (req.body.adminPassword) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.adminPassword, salt, (err, hash) => {
            if (err) throw err;
            repoFields.adminPassword = hash;

            console.log(repoFields);
            Repo.findOneAndUpdate(
              { _id: id },
              { $set: repoFields },
              { new: true }
            ).then(repo => res.json(repo));

          });
        });

      }
    }
  }
);

// @route   DELETE api/repo/:id
// @desc    Delete repo
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Repo.findById(req.params.id)
      .then(repo => {
        // Delete
        repo.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ reponotfound: 'No repo found' }));
  });

//------------------------------------------------------------------------------
// @route   GET api/repo/searchUsersByAdmin/:searchTerm/:adminEmail
// @desc    Search repoUser
// @access  Public
router.get('/searchUsersByAdmin/:searchTerm/:adminEmail',
  (req, res) => {
    const searchTerm = req.params.searchTerm;
    const adminEmail = req.params.adminEmail;

    console.log('searchUsersByAdmin adminEmail ', adminEmail);

    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

    //  connect to sysDB
    util.connectSysDatabase();
    
    //  find Repo by adminEmail
    Repo.findOne({ 'adminEmail': adminEmail })
      .then(repo => {
        console.log('Found repo: ', repo._id);
        //  find user by Repo
        var filter = {};
        filter = {
          $and: [
            {repoid: repo._id}, 
          ]
        };
        if (searchTerm != '*') {
          filter = {
            $and: [
              {repoid: repo._id}, 
              {userEmail: { "$regex": searchTerm, "$options": "i" }},  
            ]
          };
        }
        console.log('filter ', filter);
        RepoUser.find(filter)
          .then(repoUsers => {
            console.log('Found users', repoUsers);
            res.json(repoUsers);
          })
          .catch(err => res.status(404).json({ repoUser: 'There are no repoUsers' }));
      })
      .catch(err => res.status(404).json({ repo: 'There are no repos' }));

  }
);

// @route   POST api/repo/repouser
// @desc    Add repo 
// @access  Private
router.post(
  '/repouser',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;

    const { errors, isValid } = validateRepoUserInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    if (id === undefined) {
      const adminEmail = req.body.adminEmail;
      //  find Repo by adminEmail
      Repo.findOne({ 'adminEmail': adminEmail })
        .then(repo => {
          //create new repo in sysdb
          const newRepoUser = new RepoUser({
            repoid: repo._id,
            userEmail: req.body.userEmail,
          });
          console.log('111');
          newRepoUser.save().then(repoUser => {
            //create user in this renter db
            const connectionDb = repo.repoConnectionUrl;
            const adminEmail = req.body.adminEmail;
            const userData = {
              adminEmail: adminEmail,
              email: repoUser.userEmail,                          
            };

            console.log('222 ', userData);
            const serviceUrl = process.env.REACT_APP_USER_SERVICE_URL;

            const url = `${serviceUrl}/api/users/createuser`; 
  
            console.log('333 ', url);
            axios
              .post(url, userData)
              .then(res =>{
                console.log('4 ');
                console.log('Created user ok');
              })
              .catch(err => {
                console.log('5 ');
                console.log('Created user fail', err);
              });


              console.log('6 ', repoUser);
              res.json(repoUser);            



          });          
        })
        .catch(err => res.status(404).json({ repo: 'There are no repos' }));
    }
    else {
      //update repo
      const repoFields = {};
      if (req.body.userEmail)
        repoFields.userEmail = req.body.userEmail;

      RepoUser.findOneAndUpdate(
        { _id: id },
        { $set: repoFields },
        { new: true }
      ).then(repoUser => res.json(repoUser));

    }
  }
);

// @route   DELETE api/repo/repouser/:id
// @desc    Delete repouser
// @access  Private
router.delete(
  '/repouser/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.params.id;
    RepoUser.findById(id)
      .then(repo => {
        // Delete
        repo.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ reponotfound: 'No repo found' }));
  });

module.exports = router;