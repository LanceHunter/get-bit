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

})


//Rendering Bits Page
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  return knex('jokes')
    .innerJoin('labels', 'labels.label_id', 'jokes.label_id')
    .select('jokes.joke_title', 'labels.label')
    .where('jokes.user_id', id)

.then(function(jokesArr){
  res.render('../views/bits.ejs', {jokes: jokesArr});
})
.catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
})


//Rendering individial bit/ review bit
router.get('/:id/:bitId', (req, res, next) => {
  const id = req.params.id;
  const bitId = req.params.bitId;

  return knex('jokes')
    .innerJoin('labels', 'labels.label_id', 'jokes.label_id')
    .select('jokes.joke_title', 'labels.label')
    .where({'jokes.user_id': id,
    'jokes.joke_id': bitId})

  .then(function(bitObj) {
      res.render('../views/reviewBit.ejs', {
        bit: bitObj
      });
  })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})


//Updating Bit / review page
router.put('/:id/:bitId', (req, res, next) => {

})


//Delete Bit
router.delete('/:id/:bitId', (req, res, next) => {

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
