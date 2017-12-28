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
// const id = req.params.id; user_id
// const bitId = req.params.bitId; joke_id
// const labelId = req.params.labelId; label_id


//Rendering New Bit Page
router.get('/:id/new', (req, res, next) => {
  res.render('../views/newBit.ejs');
})


//Creating New bit
router.post('/:id/new', (req, res, next) => {
  res.redirect('../views/bits.ejs')
})


//Rendering Bits
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('jokes')
  .innerJoin('labels', 'jokes.user_id', 'labels.user_id')
  .where('jokes.user_id', id)
  .returning('*')

.then(function(jokes){
  knex('jokes')
  .innerJoin('jokes_performances', 'jokes.joke_id', 'jokes_performances.joke_id')
  .innerJoin('performances', 'jokes_performances.per_id', 'performances.per_id')
  .avg('performances.rating')
  .returning('*')
})
  .then(function(jokes) {
    console.log(jokes)
    res.render('../views/bits.ejs', {
      bits: jokes
      });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})


//Rendering individial bit - Review Bit
router.get('/:id/:bitId', (req, res, next) => {
  const id = req.params.id;
  const bitId = req.params.bitId;


})


//Updating Bit - Review Bit
router.put('/:id/:bitId', (req, res, next) => {
  res.redirect('../views/bits.ejs')
})


//Delete Bit - Review Bit
router.delete('/:id/:bitId', (req, res, next) => {
  res.redirect('../views/bits.ejs')
})



//Create Label
router.post('/:id/label', (req, res, next) => {

})

//Adding Label to Bit
router.post('/:id/:bitId/labelId', (req, res, next) => {

})


//Deleting Label from Bit
router.delete('/:id/:bitId/:labelId', (req, res, next) => {

})


//Delete Label
router.delete('id:/label/:labelId', (req, res, next) => {

})



module.exports = router;
