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


//Rendering pers.ejs
router.get('/pers', (req, res, next)=>{
  res.render('pers');
})


//Rendering individual performance
router.get('/pers/:id', (req, res, next)=>{
  res.render('reviewPer');
})


//Updating Individual Performance
router.put('/pers/:id', (req, res, next)=>{

})


//Rendering New Performance Page
router.get('/pers/new', (req, res, next){
  res.render('newPer');
})


//Creating New Performance
router.post('/pers/new', (req, res, next)=>{

})


//Sending New Performance Info to Live Performance Page
router.post('/pers/live', (req, res, next)=>{
  res.render('livePer');
})



module.exports = router;
