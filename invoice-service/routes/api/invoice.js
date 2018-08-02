const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../../common/util.js");

// Invoice model
const Invoice = require('../../models/Invoice');

// Load Validation
const validateInvoiceInput = require('../../validation/invoice');

// @route   GET api/invoice/test
// @desc    Tests Invoice route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Invoice Works' }));

// @route   GET getInvoicesByAttacher/:attacherid/:attacherType/:searchTerm
// @desc    Search invoice
// @access  Public
router.get('/getInvoicesByAttacher/:attacherid/:attacherType/:searchTerm/:userEmail',
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
            { invoiceNo: { "$regex": searchTerm, "$options": "i" } },
          ]
        };
      }

      if (attacherType != 1) //ALL 
      {
        filter.attacherid = attacherid;
        filter.attacherType = attacherType;
      }

      Invoice.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(invoices => {
          if (!invoices) {
            errors.noinvoice = 'There are no invoices';
            console.log(errors.noinvoice);
            return res.status(404).json(errors);
          }
          res.json(invoices);
        })
        .catch(err => res.status(404).json({ invoice: 'There are no invoices' }));
    });
  }
);

// @route   GET api/invoice/all
// @desc    Get all invoice
// @access  Public
router.get('/all',
  (req, res) => {
    const errors = {};
    Invoice.find()
      .then(invoices => {
        if (!invoices) {
          errors.noinvoice = 'There are no invoices';
          console.log(errors.noinvoice);
          return res.status(404).json(errors);
        }
        res.json(invoices);
      })
      .catch(err => res.status(404).json({ invoice: 'There are no invoices' }));
  }
);

// @route   GET api/invoice/:id/:userEmail
// @desc    Get invoice by id
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Task with userEmail ', userEmail);

  util.connectDatabaseByUserEmail(userEmail, () => {
    Invoice.findById(id)
      .then(invoice => {
        res.json(invoice);
      })
      .catch(err =>
        res.status(404).json({ noinvoicefound: 'No invoice found with that ID' })
      );
  });
});
// @route   POST api/invoice
// @desc    Add invoice 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {
      console.log('Connected to DB with userEmail ', userEmail);

      const { errors, isValid } = validateInvoiceInput(req.body);
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }

      if (id === undefined) {
        //create new invoice
        const newInvoice = new Invoice({
          invoiceNo: req.body.invoiceNo,
          invoiceDate: req.body.invoiceDate,
          description: req.body.description,
          termsConditions: req.body.termsConditions,
          dueDate: req.body.dueDate,
          balanceDue: req.body.balanceDue,

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
        newInvoice.save().then(invoice => res.json(invoice));
      }
      else {
        //update 
        const invoiceFields = {};
        if (req.body.invoiceNo)
          invoiceFields.invoiceNo = req.body.invoiceNo;
        if (req.body.invoiceDate)
          invoiceFields.invoiceDate = req.body.invoiceDate;
        if (req.body.description)
          invoiceFields.description = req.body.description;
        if (req.body.termsConditions)
          invoiceFields.termsConditions = req.body.termsConditions;
        if (req.body.dueDate)
          invoiceFields.dueDate = req.body.dueDate;
        if (req.body.balanceDue)
          invoiceFields.balanceDue = req.body.balanceDue;

        if (req.body.clientid)
          invoiceFields.client = req.body.clientid;
        if (req.body.clientName)
          invoiceFields.clientName = req.body.clientName;

        if (req.body.userid)
          invoiceFields.user = req.body.userid;
        if (req.body.userName)
          invoiceFields.userName = req.body.userName;
        if (req.body.userEmail)
          invoiceFields.userEmail = req.body.userEmail;

        if (req.body.attacherid)
          invoiceFields.attacherid = req.body.attacherid;
        if (req.body.attacherTag)
          invoiceFields.attacherTag = req.body.attacherTag;
        if (req.body.attacherType)
          invoiceFields.attacherType = req.body.attacherType;


        if (req.body.invoiceExpenses)
          invoiceFields.invoiceExpenses = req.body.invoiceExpenses;
        if (req.body.invoicePayments)
          invoiceFields.invoicePayments = req.body.invoicePayments;
        if (req.body.invoiceAdjustments)
          invoiceFields.invoiceAdjustments = req.body.invoiceAdjustments;

        if (req.body.createdDate)
          invoiceFields.createdDate = req.body.createdDate;

        console.log(invoiceFields);
        Invoice.findOneAndUpdate(
          { _id: id },
          { $set: invoiceFields },
          { new: true }
        ).then(invoice => {
          res.json(invoice);
        })
          .catch(err => {
            res.status(404).json({ invoiceError: 'invoice saved err' + err })
          });
      }
    }
    );
  }
);

// @route   DELETE api/invoice/:id
// @desc    Delete invoice
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

      Invoice.findOne(filter)
        .then(invoice => {
          // Delete
          invoice.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ invoicenotfound: 'No invoice found' }));
    });
  });


module.exports = router;