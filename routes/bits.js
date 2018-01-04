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


////Rendering New Bit Page
router.get('/:id/new', (req, res, next) => {
  let id = filterInt(req.params.id);
  console.log(id);

  return knex('labels')
    .where('labels.user_id', id)
    .select('*')
    .then(function(labelsArr) {
      res.render('../views/newBit.ejs', {
        onBits: true,
        userID: id,
        labels: labelsArr
      });
    })

})


////Creating New Bit
router.post('/:id/new', (req, res, next) => {
  const id = req.params.id;
  console.log(id)
  const newJoke = req.body;
  console.log(newJoke, "new Joke");

  let joke = {

    joke_title: newJoke.joke_title
  }
  console.log(joke);
  let body = {
    body: newJoke.body
  }
  console.log(body);
  let tag = {
    tag: newJoke.tag
  }
  console.log(tag);
  let label = {

    label: newJoke.label,

  }
  console.log(label);

  // knex('labels').insert(label).where('labels.user_id', id).returning('*')
  //   .then((labels) => {
  //     joke.label_id = labels[0].label_id;
  //     return knex('jokes').insert(joke).returning('*')
  //   }).then((jokes) => {
  //     body.joke_id = jokes.joke_id;
  //     return knex('joke_body').insert(body).returning('*')
  //   })
  //   .then((body) => {
  //     tag.joke_id = body[0].joke_id;
  //     return knex('tags').insert(tag);
  //   })
  //   .then(() => {
  //     res.redirect('../views/bits.ejs')
  //   })

})

////Rendering Bits
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  let secondLabelArr = [];
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
    //Grabbing Labels for Jokes
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
    })
    //Grabbing Labels for dropdown
    .then(function() {
      return knex('labels')
        .where('labels.user_id', id)
        .select('labels.label')
    })
    .then(function(labArr) {
      secondLabelArr.forEach((lab, index) => {
        lab.label = labArr[index].label
      })
      console.log(jokeArr)
      res.render('../views/bits.ejs', {
        onBits: true,
        userID: id,
        bits: jokeArr,
        labels: labArr
      });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})


////Rendering individial bit - Review Bit
router.get('/:id/:bitId', (req, res, next) => {
  const id = req.params.id;
  const bitId = req.params.bitId;
  let jokeArr = [];
  let perArr = [];
  let secondLabelArr = [];
  let tagArr = [];

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
      return knex('jokes')
        .innerJoin('tags',
          'jokes.joke_id', 'tags.joke_id')
        .where('jokes.joke_id', bitId)
        .select('jokes.joke_id', 'tags.tag')
    })
    .then(function(tagsArr) {
      if (tagsArr) {
        tagsArr.forEach((tags) => {
          tagArr.push({
            joke_id: tags.joke_id,
            tag: tags.tag
          })
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
      jokeArr.forEach((joke, index) => {
        joke.body = bodyArr[index].body

      })
    })
    //Grabbing Performance Titles
    .then(function() {
      return knex('jokes')
        .innerJoin('jokes_performances', 'jokes.joke_id', 'jokes_performances.joke_id')
        .innerJoin('performances', 'jokes_performances.per_id', 'performances.per_id')
        .select('performances.per_id', 'performances.user_id', 'performances.per_title', 'performances.rating')
        .where('jokes.joke_id', bitId)
    })
    .then(function(persArr) {
      persArr.forEach((perf, index) => {
        perArr.push({
          per_title: perf.per_title,
          rating: perf.rating,
          per_id: perf.per_id,
          user_id: perf.user_id
        })
      })
    })
    //Grabbing Labels for Individual Joke
    .then(function() {
      return knex('jokes')
        .leftOuterJoin('labels', 'jokes.label_id', 'labels.label_id')
        .select('jokes.label_id', 'labels.label_id', 'labels.label')
        .where('jokes.joke_id', bitId)
    })
    .then(function(labelsArr) {
      jokeArr.forEach((joke, index) => {
        joke.label = labelsArr[index].label
      })
    })
    //Grabbing Labels for dropdown
    .then(function() {
      return knex('labels')
        .where('labels.user_id', id)
        .select('labels.label')
    })
    .then(function(labArr) {
      labArr.forEach((lab, index) => {
        secondLabelArr.push({
          label: lab.label,
          user_id: lab.user_id
        })
      })
      res.render('../views/reviewBit.ejs', {
        onBits: true,
        userID: id,
        bitID: bitId,
        bitObj: jokeArr,
        pers: perArr,
        label: secondLabelArr,
        tags: tagArr
      });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})


////Updating Bit - Review Bit
router.put('/:id/:bitId', (req, res, next)
 => {
   const id = req.params.id;
   console.log(id);
  res.redirect('../views/bits.ejs')
})


////Delete Bit - Review Bit
router.delete('/:id/:bitId', (req, res, next) => {
  res.redirect('../views/bits.ejs')
})


////Create Label
router.post('/:id/label', (req, res, next) => {

})

////Adding Label to Bit
router.post('/:id/:bitId/labelId', (req, res, next) => {

})


////Deleting Label from Bit
router.delete('/:id/:bitId/:labelId', (req, res, next) => {

})


////Delete Label
router.delete('id:/label/:labelId', (req, res, next) => {

})


module.exports = router;
