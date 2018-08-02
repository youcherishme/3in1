const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const util = require("../../common/util.js");
const mongoose = require('mongoose');

// Load User model
const User = require('../../models/User');
const Repo = require('../../models/Repo');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.post('/upload', (req, res) => {
  if (!req.files)
    return;
  var aaa = `${__dirname}`;
  console.log('file aaa : ' + aaa);

  let imageFile = req.files.file;
  let fileUrl = `${__dirname}/public/${imageFile.name}`;
  //let fileUrl = `/public/${imageFile.name}`;
  console.log('file 112: ' + fileUrl);

  imageFile.mv(fileUrl, function (err) {
    console.log('222');
    if (err) {
      console.log('444');
      console.log(err);
      return res.status(500).send(err);
    }

    res.json({ file: `public/${imageFile.name}` });
  });

});

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log('register');
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //ttt: tepm
  const dbConnection = 'mongodb://admindbuser:admindbuser@ds053216.mlab.com:53216/allin1db'
  util.connectDatabaseByDbConnection(dbConnection);

  // Load User model
  var User = require('../../models/User');

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      console.log(newUser);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});


// @route   POST api/users/createuser
// @desc    create user by admin
// @access  Public
router.post('/createuser', (req, res) => {
  console.log('createuser ');

  const adminEmail = req.body.adminEmail;
  const email = req.body.email;
  const password = 'changemenow';
  const name = email;

  console.log('Createuser : ', adminEmail, email);

  util.connectDatabaseByAdminEmail(adminEmail, () => {
    User.findOne({ email }).then(user => {
      if (user) {
        var errors = {};
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });

        const newUser = new User({
          name: name,
          email: email,
          avatar,
          password: password,
          password2: password,
        });
        console.log('new user : ', newUser);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                console.log('Createuser OK ', user);
                //return
                res.json(user);
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  console.log('Login: ', email);
  util.connectDatabaseByUserEmail(email, (err) => {
    if(err)
      return res.status(404).json(err);
      
    console.log('Found db');
    // Find user by email
    User.findOne({ email }).then(user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = { id: user.id, name: user.name, email: user.email, avatar: user.avatar }; // Create JWT Payload

          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            }
          );
        } else {
          errors.password = 'Password incorrect';
          return res.status(400).json(errors);
        }
      });
    });
  });
});

// @route   GET api/users/loginsystem
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/loginsystem', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  console.log('Login system: ', email, ' ', password);

  util.connectSysDatabase();
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: '0000', name: user.name, email: user.password, avatar: '' }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  })
});

// @route   GET api/users/loginadmin
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/loginadmin', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  console.log('Login admin: ', email, password);
  util.connectSysDatabase(email);

  Repo.findOne({ "adminEmail": email }).then(repo => {
    // Check for user
    if (!repo) {
      errors.email = 'Repo not found';
      return res.status(404).json(errors);
    }
    console.log(repo);
    // Check Password
    bcrypt.compare(password, repo.adminPassword).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: 'AAAA', name: repo.adminName, email: repo.adminEmail, avatar: '' }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });

  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

router.changePassword(
  '/changePassword/:password/:userEmail',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const password = req.params.password;
    const userEmail = req.params.userEmail;
    console.log('changePassword with userEmail ', userEmail);

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
