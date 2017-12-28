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

const id = req.params.id;
const perId = req.params.perId;



//Rendering pers.ejs
router.get('/:id', (req, res, next)=>{
  knex('performances')
  .select('title', 'date', 'rating')
  .where('performances.user_id', id)
  .then(function(persArr){
    res.render('pers', {pers: persArr});
  })
  .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})


//Rendering individual performance
router.get('/:id/:perId', (req, res, next)=>{

  knex('performances')
  .select('title', 'date', 'rating')
  .where('performances.per_id', perId)
  .then(function(perObj){
    res.render('reviewPer', {per: perObj});
  })
  .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})


//Updating Individual Performance
router.put('/:id/:perId', (req, res, next)=>{

})


//Rendering New Performance Page
router.get('/:id/new', (req, res, next)=>{
  res.render('newPer');
})


//Creating New Performance
router.post('/:id/new', (req, res, next)=>{

})


//Sending New Performance Info to Live Performance Page
router.post('/:id/:perId/live', (req, res, next)=>{

  res.render('livePer');
})



module.exports = router;
