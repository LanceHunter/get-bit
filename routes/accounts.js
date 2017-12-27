'use strict';

//Setting up knex
const env = 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);

//Setting up express routing
const express = require('express');
const router = express.Router();

//Setting up bcrypt
const bcrypt = require('bcrypt');


// filterInt - The function from MDN that confirms a particular value is actually an integer. Because parseInt isn't quite strict enough.
const filterInt = function(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
};

router.get('/login', (req, res) => {
  res.render('../views/login.ejs');
});

router.get('/create', (req, res) => {
  res.render('../views/createAccount.ejs');
});


////To be worked on after login paths set...
router.get('/:id/update', (req, res) => {

  res.render('../views/updateAccount.ejs');
});

router.post('/create', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});



module.exports = router;
