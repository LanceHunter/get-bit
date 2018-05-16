'use strict';

//Setting up knex
const env = process.env.ENVIORNMENT || 'development';
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

// Authorization middleware. Reroutes to / if user isn't logged in to the account they want to access.
router.get('/new' , (req, res, next) => {
  if (req.session.userID) {
    console.log('user is logged in');
    next();
  } else {
    console.log(`user is NOT logged in.`);
    res.redirect('/');
  }
});



////Rendering New Bit Page
router.get('/new', (req, res, next) => {
  const id = filterInt(req.session.userID);
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
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})


////Creating New bit
router.post('/:id/new', (req, res, next) => {

  const id = filterInt(req.params.id);
  const newJoke = req.body;
  console.log(req.body, "new joke")

  let joke = {
    user_id: id,
    joke_title: newJoke.joke_title,
    label_id: filterInt(newJoke.label_id)
  }

  let body = {
    body: newJoke.body
  }

  let tag = {
    tag: newJoke.tag
  }

  knex('jokes').insert(joke).returning('*')
    .then((jokes) => {
      body.joke_id = jokes[0].joke_id;
      return knex('joke_body').insert(body).returning('*')
    }).then((body) => {
      if (!tag.tag) {
        return;
      } else {
        tag.joke_id = body[0].joke_id;
        return knex('tags').insert(tag).returning('*')
      }
    })
    .then((joke) => {
      res.redirect(`bits/${id}`)
    })
})

////Rendering Bits
router.get('/:id', (req, res, next) => {
  const id = filterInt(req.params.id);

  let jokeArr = [];
  //Grabbing Jokes
  return knex('jokes')
    .where('jokes.user_id', id)
    .then(function(jokes) {
      jokeArr = jokes;
      let idArr = jokeArr.map((joke) => {
        return joke.joke_id;
      })
      console.log(idArr);
      //Grabbing Ratings
      return knex('jokes_performances').whereIn('joke_id', idArr)
        .fullOuterJoin('performances', 'jokes_performances.per_id', 'performances.per_id')
        .avg('performances.rating')
        // .select('*')
        .groupBy('joke_id')
    })
    .then(function(ratingsArr) {
      jokeArr.forEach((joke, index) => {
        if (ratingsArr[index]) {
          joke.avg = ratingsArr[index].avg
        } else {
          joke.avg = 0;
        }

      })
    })
    // Grabbing individual Label for Jokes
    .then(function() {
      return knex('labels')
        .where('labels.user_id', id)
        .select('labels.label', 'labels.label_id')
    })
    .then(function(labelArr) {
      jokeArr.forEach((joke, index) => {
        labelArr.forEach((label) => {
          if (label.label_id === joke.label_id) {
            joke.label = label.label
          }
        })
      })
    })
    // Grabbing Labels for dropdown
    .then(function() {
      return knex('labels')
        .where('labels.user_id', id)
        .select('labels.label', 'labels.label_id')
    })
    .then(function(labArr) {

      console.log(jokeArr);
      console.log(labArr);


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
  const id = filterInt(req.params.id);
  const bitId = filterInt(req.params.bitId);
  let jokeArr = [];
  let perArr = [];
  let tagArr = [];

  //Grabbing Jokes
  knex('jokes')
    .select('*')
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
        if (ratingsArr[index]) {
          joke.avg = ratingsArr[index].avg
        } else {
          joke.avg = 0;
        }
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
    //Grabbing Label for Individual Joke
    .then(function() {
      return knex('jokes')
        .leftOuterJoin('labels', 'jokes.label_id', 'labels.label_id')
        .select('labels.label', 'labels.label_id')
        .where('jokes.joke_id', bitId)
    })
    .then(function(labelsArr) {
      console.log(labelsArr, "here")
      jokeArr.forEach((joke, index) => {
        joke.label = labelsArr[index].label
      })
    })
    //Grabbing Labels for dropdown
    .then(function() {
      return knex('labels')
        .where('labels.user_id', id)
        .select('labels.label', 'labels.label_id')
    })
    .then(function(labArr) {
      console.log(labArr, "labels");
      console.log(jokeArr, "jokes");
      res.render('../views/reviewBit.ejs', {
        onBits: true,
        userID: id,
        bitID: bitId,
        bitObj: jokeArr,
        pers: perArr,
        label: labArr,
        tags: tagArr
      });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})


////Updating Bit - Review Bit
router.put('/:id/:bitId', (req, res, next) => {
  const id = filterInt(req.params.id);
  const bitId = filterInt(req.params.bitId);
  const joke = req.body;
console.log("wtf is going on", req.body);

  let title = {
    joke_title: joke.joke_title,
    label_id: filterInt(joke.label_id)
  }
  console.log(title);
  let body = {
    body: joke.body
  }

  knex('jokes')
  .where('joke_id', bitId)
  .update(title)
  .then(()=>{
    console.log("wtf")
    return knex('joke_body')
    .where('joke_id', bitId)
    .update(body)
  }).then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.error('Error while updating', err);
    res.sendStatus(500);
  })

})



////Delete Bit - Review Bit
router.delete('/:id/:bitId', (req, res, next) => {
  const id = filterInt(req.params.id);
  const bitId = filterInt(req.params.bitId);

  console.log("wtf is going on", req.body);

  knex('jokes_performances').where('joke_id', bitId).del()
    .then(() => {
      return knex('jokes').where('joke_id', bitId).del();
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Error while deleting - ', err);
      res.sendStatus(500);
    })
})

///New Tag - Review Page
router.post('/:id/:bitId', (req, res, next) => {
  const id = filterInt(req.params.id);
  const bitId = filterInt(req.params.bitId);
  const newTag = req.body;

  let tag = {
    joke_id: bitId,
    tag: newTag.tag
  }
  console.log(tag);
  knex('tags').insert(tag)
    .then(() => {

    })

})

////Create Label
router.post('/newLabel', (req, res, next) => {
  const id = filterInt(req.params.id);
  const newLabel = req.body;

  console.log(newLabel, 'body of label')


  let label = {

    user_id: filterInt(newLabel.user_id),
    label: newLabel.label
  }
  console.log(label, "obeject");
  knex('labels').insert(label)
    .then(() => {

    })

})


////Delete Label
router.delete('id:/:bitID/:tagID', (req, res, next) => {

})


module.exports = router;
