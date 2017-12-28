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


//ID Variables
// const id = req.params.id;
// const bitId = req.params.bitId;
// const lableId = req.params.labelId;


//Rendering bits.ejs page
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  return knex('jokes')
    .select('*')
    .where('jokes.user_id', id)
    .then(function(jokes) {
      return knex('performances')
        .innerJoin('jokes_performances', 'performances.per_id', 'jokes_performances.per_id')
        .avg('performances.rating')
        .where('jokes.user_id', 'performances.user_id')
        .returning('*')
    })
    .then(function(bitsArr) {
      res.render('bits', {
        bits: bitsArr
      });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})


//Rendering individial bit
router.get('/:id/:bitId', (req, res, next) => {
  const id = req.params.id;
  const bitId = req.params.bitId;
  return knex('jokes')
    .select('*')
    .where('jokes.jokes_id', bitId)
    .then(function(jokes) {
      return knex('performances')
        .innerJoin('jokes_performances', 'performances.per_id', 'jokes_performances.per_id')
        .avg('performances.rating')
        .where('jokes.user_id', 'performances.user_id')
        .returning('*')
    })
    .then(function(bitObj) {
      res.render('reviewBit', {
        bit: bitObj
      });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})



//Updating Bit
router.put('/:id/:bitId', (req, res, next) => {

})


//Adding Label to Bit
router.post('/:id/:bitId/label', (req, res, next) => {

})


//Deleting Label from Bit
router.delete('/:id/:bitId/:labelId', (req, res, next) => {

})

//Rendering New Bit Page
router.get('/:id/new', (req, res, next) => {
  res.render('newBit');
})


//Creating New bit
router.post('/:id/new', (req, res, next) => {

})


//Create Label
router.post('/:id/label', (req, res, next) => {

})


//Delete Label
router.delete('id:/label/:labelId', (req, res, next) => {

})



module.exports = router;
