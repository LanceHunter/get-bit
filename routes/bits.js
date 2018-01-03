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
  const id = req.params.id;
  res.render('../views/newBit.ejs', {
    onBits: true,
    userID: id});
})


//Creating New bit
router.post('/:id/new', (req, res, next) => {
  res.redirect('../views/bits.ejs')
})


//Rendering Bits
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  let jokeArr = [];
  //Graabing Jokes
  return knex('jokes')
    .where('jokes.user_id', id)

    .then(function(jokes) {
      jokeArr = jokes.map((joke) => {
        return joke;

      });

      let idArr = jokeArr.map((joke) => {
        return joke.joke_id;
      })
      //Grabbing Ratings
      return knex('jokes_performances').whereIn('joke_id', idArr)
        .innerJoin('performances', 'jokes_performances.per_id', 'performances.per_id')
        .avg('performances.rating')
        .groupBy('joke_id')


    })
    .then(function(ratingsArr) {
      jokeArr.forEach((joke, index) => {
        joke.avg = ratingsArr[index].avg
      })
    })
    //Grabbing Labels
    .then(function() {
      return knex('jokes')
        .leftOuterJoin('labels', 'jokes.label_id', 'labels.label_id')
        .select('labels.label')
        .where('jokes.user_id', id)
    })
    .then(function(labelArr) {
      jokeArr.forEach((joke, index) => {
        joke.label = labelArr[index].label
      })

      res.render('../views/bits.ejs', {
        onBits: true,
        userID: id,
        bits: jokeArr
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
  let jokeArr = [];
  //Grabbing Jokes
  knex('jokes')
    .where('jokes.joke_id', bitId)

    .then(function(jokes) {

      jokeArr = jokes.map((joke) => {
        return joke;

      });
      let idArr = jokeArr.map((joke) => {
        return joke.joke_id;
      })
      //Grabbing Ratings
      return knex('jokes_performances').whereIn('joke_id', idArr)
        .innerJoin('performances', 'jokes_performances.per_id', 'performances.per_id')
        .avg('performances.rating')
        .groupBy('joke_id')

    })
    .then(function(ratingsArr) {

      jokeArr.forEach((joke, index) => {
        joke.avg = ratingsArr[index].avg
      })
    })
    //Grabbing Tags
    .then(function() {
      return knex('tags')
        .where('tags.joke_id', bitId)
        .select('tag')
    })
    .then(function(tagsArr) {

      if (tagsArr) {
        jokeArr.tags = [];
        tagsArr.forEach((jokeTag, index) => {
          jokeArr.tags.push(jokeTag.tag);
        })
      }

    })
    //Grabbing Body
    .then(function() {
      return knex('joke_body')
        .orderBy('created_at', 'desc')
        .where('joke_body.joke_id', bitId)
        .select('body', 'created_at')
    })
    .then(function(bodyArr) {
      console.log(bodyArr)
      jokeArr.forEach((joke, index) => {
        joke.body = bodyArr[index].body

      })
    })
    //Grabbing Performance Titles
    .then(function() {
      return knex('jokes')
        .innerJoin('jokes_performances', 'jokes.joke_id', 'jokes_performances.joke_id')
        .innerJoin('performances', 'jokes_performances.per_id', 'performances.per_id')
        .select('performances.per_title')
        .where('jokes.joke_id', bitId)
    })
    .then(function(perArr) {

      jokeArr.per_titles = [];
      perArr.forEach((jokePer, index) => {
        jokeArr.per_titles.push(jokePer.per_title)
      })
    })
    .then(function() {
      return knex('jokes')
        .leftOuterJoin('labels', 'jokes.label_id', 'labels.label_id')
        .select('labels.label')
        .where('jokes.joke_id', bitId)
    })
    .then(function(labelArr) {
      jokeArr.forEach((joke, index) => {
        joke.label = labelArr[index].label
      })
        console.log(jokeArr)
      res.render('../views/reviewBit.ejs', {
        onBits: true,
        userID: id,
        bitID: bitId,
        bit: jokeArr
      });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });

})


//Updating Bit - Review Bit
router.put('/:id/:bitId', (req, res, next) => {
  res.redirect('../views/bits.ejs')
})


//Delete Bit - Review Bit
router.delete('/:id/:bitId', (req, res, next) => {
  res.redirect('../views/bits.ejs')
})


//Get labels
router.get('/:id/labels', (req, res, next) => {
const id = req.params.id
  knex('jokes')
    .leftOuterJoin('labels', 'jokes.label_id', 'labels.label_id')
    .select('labels.label')
    .where('jokes.user_id', id)

    .then(function(labelsArr){
      console.log(labelsArr)
      // res.send('../views/bits.ejs', {labels:labelsArr
      // });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
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
