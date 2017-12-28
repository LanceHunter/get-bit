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


// Id Variables
// const id = req.params.id; user_id
// const perId = req.params.perId; per_id


//Rendering New Performance Page
router.get('/:id/new', (req, res, next) => {
  res.render('../views/newPer.ejs');
})


//Creating New Performance
router.post('/:id/new', (req, res, next) => {

})



//Sending New Performance Info to Live Performance Page
router.get('/:id/:perId/live', (req, res, next) => {
    res.render('../views/livePer.ejs');

})


//Rendering pers.ejs

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
console.log('wtf');
  return knex('performances')
  .select('performances.per_title', 'performances.date', 'performances.rating')
  .where('performances.user_id', id)
.then(function(persArr){
  res.render('../views/pers.ejs', {pers: persArr});
})
.catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });

})


//Rendering individual performance
router.get('/:id/:perId', (req, res, next) => {

  const id = req.params.id;
  const perId = req.params.perId;

  res.render('../views/reviewPer.ejs')

})

//Updating Individual Performance
router.put('/:id/:perId', (req, res, next) => {

})



router.post('/:id/:perId/live', (req, res, next) => {
  res.render('../views/livePer.ejs');
})



module.exports = router;
