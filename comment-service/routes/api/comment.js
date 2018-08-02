const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../../common/util.js");

// Comment model
const Comment = require('../../models/Comment');

// Load Validation
const validateCommentInput = require('../../validation/comment');

// @route   GET api/comment/test
// @desc    Tests Comment route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Comment Works' }));

// @route   GET api/comment/getCommentsByAttacher
// @desc    Get  getCommentsByAttacher
// @access  Public
router.get('/getCommentsByAttacher/:attacherid/:attacherType/:searchTerm/:userEmail',
  (req, res) => {
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

    const attacherid = req.params.attacherid;
    const attacherType = req.params.attacherType;
    const searchTerm = req.params.searchTerm;
    const userEmail = req.params.userEmail;

    console.log(attacherid);
    console.log(attacherType);

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

      Comment.find(filter)
      .sort({ 'createdDate': -1 })
      .limit(PAGE_LIMIT)
      .then(comments => {
        if (!comments) {
          errors.nocomment = 'There are no comments';
          console.log(errors.nocomment);
          return res.status(404).json(errors);
        }
        res.json(comments);
      })
      .catch(err => res.status(404).json({ document: 'There are no comments' }));
  });
}
);

// @route   GET api/comment/all
// @desc    Get all comment
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Comment.find()
      .then(comments => {
        if (!comments) {
          errors.nocomment = 'There are no comments';
          console.log(errors.nocomment);
          return res.status(404).json(errors);
        }
        res.json(comments);
      })
      .catch(err => res.status(404).json({ comment: 'There are no comments' }));
  }
);
// @route   GET api/comment/:id/:userEmail
// @desc    Get comment by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Appointment with userEmail ', userEmail);

  util.connectDatabaseByUserEmail(userEmail, () => {
    Comment.findById(id)
    .then(comment => {
      res.json(comment);
    })
    .catch(err =>
      res.status(404).json({ nocommentfound: 'No comment found with that ID' })
    );
  });
});

// @route   POST api/comment
// @desc    Add comment 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {
      console.log('Connected to DB with userEmail ', userEmail);

    const { errors, isValid } = validateCommentInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    if (id === undefined) {
      //create new comment
      const newComment = new Comment({
        user: req.body.userid,
        userName: req.body.userName,
        userEmail: req.body.userEmail,

        content: req.body.content,
        commentDate: req.body.commentDate,
        attacherid: req.body.attacherid,
        attacherType: req.body.attacherType,
        createdDate: req.body.createdDate,
      });
      newComment.save().then(comment => res.json(comment));
    }
    else {
      //update comment
      const commentFields = {};
      if (req.body.userid)
        commentFields.user = req.body.userid;
      if (req.body.userName)
        commentFields.userName = req.body.userName;
      if (req.body.userEmail)
        commentFields.userEmail = req.body.userEmail;

      if (req.body.content)
        commentFields.content = req.body.content;
      if (req.body.commentDate)
        commentFields.commentDate = req.body.commentDate;
      if (req.body.attacherType)
        commentFields.attacherType = req.body.attacherType;
      if (req.body.attacherid)
        commentFields.attacherid = req.body.attacherid;
      if (req.body.createdDate)
        commentFields.createdDate = req.body.createdDate;

      Comment.findOneAndUpdate(
        { _id: id },
        { $set: commentFields },
        { new: true }
      ).then(comment => res.json(comment));

    }
  });
}
);

// @route   DELETE api/comment/:id
// @desc    Delete comment
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

      Comment.findOne(filter)
      .then(comment => {
        // Delete
        comment.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ commentnotfound: 'No comment found' }));
    });
  });
  

module.exports = router;