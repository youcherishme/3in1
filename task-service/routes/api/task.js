const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../../common/util.js");

// Task model
const Task = require('../../models/Task');

// Load Validation
const validateTaskInput = require('../../validation/task');

// @route   GET api/task/test
// @desc    Tests Task route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Task Works' }));

// @route   GET getTasksByAttacher/:attacherid/:attacherType/:searchTerm
// @desc    Search task
// @access  Public
router.get('/getTasksByAttacher/:attacherid/:attacherType/:searchTerm/:userEmail',
  (req, res) => {
    const errors = {};
    const PAGE_LIMIT = require('../../config/constants').PAGE_LIMIT;

    const attacherid = req.params.attacherid;
    const attacherType = req.params.attacherType;
    const searchTerm = req.params.searchTerm;
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
            {
              $or: [
                { name: { "$regex": searchTerm, "$options": "i" } },
              ]
            },
          ]
        };
      }      

      if (attacherType != 1) //ALL ttt
      {
        filter.attacherid = attacherid;
        filter.attacherType = attacherType;
      }

      Task.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(tasks => {
          if (!tasks) {
            errors.notask = 'There are no tasks';
            console.log(errors.notask);
            return res.status(404).json(errors);
          }
          res.json(tasks);
        })
        .catch(err => res.status(404).json({ task: 'There are no tasks' }));
    });
  }
);

// @route   GET api/task/:id/:userEmail
// @desc    Get task by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Task with userEmail ', userEmail);

  util.connectDatabaseByUserEmail(userEmail, () => {
    Task.findById(id)
      .then(task => {
        console.log('Found Task  ', task);
        res.json(task);
      })
      .catch(err =>
        res.status(404).json({ notaskfound: 'No task found with that ID' })
      );
  });
});

// @route   POST api/task
// @desc    Add task 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {
      console.log('Connected to DB with userEmail ', userEmail);

      const { errors, isValid } = validateTaskInput(req.body);
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }

      if (id === undefined) {
        //create new task
        const newTask = new Task({
          user: req.body.userid,
          userName: req.body.userName,
          userEmail: req.body.userEmail,
          name: req.body.name,
          dueDate: req.body.dueDate,
          description: req.body.description,
          priority: req.body.priority,
          status: req.body.status,
          createdDate: req.body.createdDate,

          attacherid: req.body.attacherid,
          attacherTag: req.body.attacherTag,
          attacherType: req.body.attacherType,
        });
        console.log('add new task for : ', newTask.userName, newTask.userEmail);
        console.log(newTask);
        newTask.save().then(task => res.json(task));
      }
      else {
        //update task
        const taskFields = {};
        if (req.body.name)
          taskFields.name = req.body.name;
        if (req.body.dueDate)
          taskFields.dueDate = req.body.dueDate;
        if (req.body.description)
          taskFields.description = req.body.description;
        if (req.body.priority)
          taskFields.priority = req.body.priority;
        if (req.body.status)
          taskFields.status = req.body.status;

        if (req.body.userid)
          taskFields.user = req.body.userid;
        if (req.body.userName)
          taskFields.userName = req.body.userName;
        if (req.body.userEmail)
          taskFields.userEmail = req.body.userEmail;

        if (req.body.attacherid)
          taskFields.attacherid = req.body.attacherid;
        if (req.body.attacherTag)
          taskFields.attacherTag = req.body.attacherTag;
        if (req.body.attacherType)
          taskFields.attacherType = req.body.attacherType;

        if (req.body.createdDate)
          taskFields.createdDate = req.body.createdDate;
        if (req.body.taskTodos)
          taskFields.taskTodos = req.body.taskTodos;

        console.log('update task for : ', taskFields.userName, taskFields.userEmail);
        Task.findOneAndUpdate(
          { _id: id },
          { $set: taskFields },
          { new: true }
        ).then(task => res.json(task));

      }
    });
  }
);

// @route   DELETE api/task/:id
// @desc    Delete task
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

      Task.findOne(filter)
        .then(task => {
          // Delete
          task.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ tasknotfound: 'No task found' }));
    });
  });


module.exports = router;