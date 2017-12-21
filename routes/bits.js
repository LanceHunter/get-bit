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


//Rendering bits.ejs page
router.get('/bits', (req, res, next)=>{
  res.render('bits');
})


//Rendering individial bit
router.get('/bits/:id', (req, res, next)=>{
  res.render('reviewBit');
})


//Updating Bit
router.put('/bit/:id', (req, res, next)=>{

})


//Adding Label to Bit
router.post('bits/:id/label', (req, res, next)=>{

})


//Deleting Label from Bit
router.delete('bits/:id/label', (req, res, next)=>{

})

//Rendering New Bit Page
router.get('bits/new', (req, res, next)=>{
  res.render('newBit');
})


//Creating New bit
router.post('bits/new', (req, res, next)=>{

})


//Create Label
router.post('bits/label', (req, res, next)=>{

})


//Delete Label
router.delete('bits/label', (req, res, next)=>{

})




module.exports = router;
