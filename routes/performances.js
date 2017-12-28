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


//Rendering Live Performance Page
router.get('/:id/:perId/live', (req, res, next) => {
  res.render('../views/livePer.ejs');
})


//Rendering New Performance Page
router.get('/:id/new', (req, res, next) => {
  res.render('../views/newPer.ejs');
})


//Creating New Performance
router.post('/:id/new', (req, res, next) => {
//Create nmew performance
//Grab new id and jokes for live performance
  res.redirect('../views/livePer.ejs')
})


//Rendering Performances
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  return knex('performances')
    .select('performances.per_title', 'performances.date', 'performances.rating')
    .where('performances.user_id', id)
    .then(function(persArr) {
      console.log(persArr);
      res.render('../views/pers.ejs', {
        pers: persArr
      });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });

})


//Rendering individual performance - Review Performance
router.get('/:id/:perId', (req, res, next) => {

  const id = req.params.id;
  const perId = req.params.perId;

  return knex('performances')
    .innerJoin('jokes_performances', 'performances.per_id', 'jokes_performances.per_id')
    .innerJoin('jokes', 'jokes_performances.joke_id', 'jokes.joke_id')
    .select('performances.per_title', 'performances.date', 'performances.rating', 'performances.audio', 'jokes.joke_title')
    .where({
      'performances.user_id': id,
      'performances.per_id': perId
    })

    .then(function(perObj) {
      console.log(perObj);
      res.render('../views/reviewPer.ejs', {
        per: perObj
      });
    })

    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });

})



//Updating Individual Performance - Review Performance
router.put('/:id/:perId', (req, res, next) => {
  res.redirect('../views/pers.ejs')
})



module.exports = router;
