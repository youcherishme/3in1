const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../../common/util.js");

// DeliveryOrder model
const DeliveryOrder = require('../../models/DeliveryOrder');

// Load Validation
const validateDeliveryOrderInput = require('../../validation/deliveryOrder');

// @route   GET api/deliveryOrder/test
// @desc    Tests DeliveryOrder route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'DeliveryOrder Works' }));

// @route   GET getDeliveryOrdersByAttacher/:attacherid/:attacherType/:searchTerm
// @desc    Search deliveryOrder
// @access  Public
router.get('/getDeliveryOrdersByAttacher/:attacherid/:attacherType/:searchTerm/:userEmail',
  (req, res) => {
    const errors = {};
    const attacherid = req.params.attacherid;
    const attacherType = req.params.attacherType;
    const searchTerm = req.params.searchTerm;
    const userEmail = req.params.userEmail;

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
            { deliveryOrderNo: { "$regex": searchTerm, "$options": "i" } },
          ]
        };
      }
      if (attacherType != 1) //ALL ttt
      {
        filter.attacherid = attacherid;
        filter.attacherType = attacherType;
      }

      DeliveryOrder.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(deliveryOrders => {
          if (!deliveryOrders) {
            errors.nodeliveryOrder = 'There are no deliveryOrders';
            console.log(errors.nodeliveryOrder);
            return res.status(404).json(errors);
          }
          res.json(deliveryOrders);
        })
        .catch(err => res.status(404).json({ deliveryOrder: 'There are no deliveryOrders' }));
    });
  }
);

// @route   GET api/deliveryOrder/all
// @desc    Get all deliveryOrder
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    DeliveryOrder.find()
      .then(deliveryOrders => {
        if (!deliveryOrders) {
          errors.nodeliveryOrder = 'There are no deliveryOrders';
          console.log(errors.nodeliveryOrder);
          return res.status(404).json(errors);
        }
        res.json(deliveryOrders);
      })
      .catch(err => res.status(404).json({ deliveryOrder: 'There are no deliveryOrders' }));
  }
);

// @route   GET api/deliveryOrder/:id/:userEmail
// @desc    Get deliveryOrder by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get quotation with userEmail ', userEmail);
  util.connectDatabaseByUserEmail(userEmail, () => {
    DeliveryOrder.findById(id)
      .then(deliveryOrder => {
        res.json(deliveryOrder);
      })
      .catch(err =>
        res.status(404).json({ nodeliveryOrderfound: 'No deliveryOrder found with that ID' })
      );
  });
});

// @route   POST api/deliveryOrder
// @desc    Add deliveryOrder 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {
      console.log('Connected to DB with userEmail ', userEmail);

      const { errors, isValid } = validateDeliveryOrderInput(req.body);
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }

      if (id === undefined) {
        //create new deliveryOrder
        const newDeliveryOrder = new DeliveryOrder({
          deliveryOrderNo: req.body.deliveryOrderNo,
          deliveryOrderDate: req.body.deliveryOrderDate,
          description: req.body.description,
          termsConditions: req.body.termsConditions,
          dueDate: req.body.dueDate,

          client: req.body.clientid,
          clientName: req.body.clientName,

          user: req.body.userid,
          userName: req.body.userName,
          userEmail: req.body.userEmail,

          attacherid: req.body.attacherid,
          attacherTag: req.body.attacherTag,
          attacherType: req.body.attacherType,
          createdDate: req.body.createdDate,

        });

        console.log(newDeliveryOrder);
        newDeliveryOrder.save().then(deliveryOrder => res.json(deliveryOrder));
      }
      else {
        //update 
        const deliveryOrderFields = {};
        if (req.body.deliveryOrderNo)
          deliveryOrderFields.deliveryOrderNo = req.body.deliveryOrderNo;
        if (req.body.deliveryOrderDate)
          deliveryOrderFields.deliveryOrderDate = req.body.deliveryOrderDate;
        if (req.body.description)
          deliveryOrderFields.description = req.body.description;
        if (req.body.termsConditions)
          deliveryOrderFields.termsConditions = req.body.termsConditions;
        if (req.body.dueDate)
          deliveryOrderFields.dueDate = req.body.dueDate;

        if (req.body.clientid)
          deliveryOrderFields.client = req.body.clientid;
        if (req.body.clientName)
          deliveryOrderFields.clientName = req.body.clientName;

        if (req.body.userid)
          deliveryOrderFields.user = req.body.userid;
        if (req.body.userName)
          deliveryOrderFields.userName = req.body.userName;
        if (req.body.userEmail)
          deliveryOrderFields.userEmail = req.body.userEmail;

        if (req.body.attacherid)
          deliveryOrderFields.attacherid = req.body.attacherid;
        if (req.body.attacherTag)
          deliveryOrderFields.attacherTag = req.body.attacherTag;
        if (req.body.attacherType)
          deliveryOrderFields.attacherType = req.body.attacherType;

        if (req.body.deliveryOrderItems)
          deliveryOrderFields.deliveryOrderItems = req.body.deliveryOrderItems;
        if (req.body.createdDate)
          deliveryOrderFields.createdDate = req.body.createdDate;

        console.log(deliveryOrderFields);
        DeliveryOrder.findOneAndUpdate(
          { _id: id },
          { $set: deliveryOrderFields },
          { new: true }
        ).then(deliveryOrder => {
          console.log('ttt 666 ');
          res.json(deliveryOrder);
        })
          .catch(err => {
            console.log('ttt 555 ');
            res.status(404).json({ deliveryOrderError: 'deliveryOrder saved err' + err })
          });
      }
    }
    );
  }
);
// @route   DELETE api/deliveryOrder/:id
// @desc    Delete deliveryOrder
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

      DeliveryOrder.findOne(filter)
        .then(deliveryOrder => {
          // Delete
          deliveryOrder.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ deliveryOrdernotfound: 'No deliveryOrder found' }));
    });
  });


module.exports = router;