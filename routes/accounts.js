'use strict';

//Setting up knex
const env = 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);

//Setting up express routing
const express = require('express');
const router = express.Router();


// filterInt - The function from MDN that confirms a particular value is actually an integer. Because parseInt isn't quite strict enough.
const filterInt = function(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
};


//Rendering login.ejs page
router.get('/login', (req, res, next)=>{
  res.render('login');
})


//Posting login information
router.post('/login', (req, res, next)=>{

})


//Rendering Create Login createAccount.ejs
router.get('/login/create', (req, res, next)=>{
  res.render('createAccount');
})


//Posting Login info to database
router.post('/login/create', (req, res, next)=>{

})


module.exports = router;
