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
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {return Number(value)};
  return NaN;
};

// Authorization middleware. Reroutes to / if user isn't logged in.
router.get('/' , (req, res, next) => {
  if (req.session.userID) {
    console.log('user is logged in');
    next();
  } else {
    console.log(`user is NOT logged in.`);
    res.redirect('/');
  }
});


//Rendering Live Performance Page
router.get('/:perId/live', (req, res, next) => {
  res.render('../views/livePer.ejs');
});

//Rendering New Performance Page
router.get('/new', (req, res, next) => {
  const id = req.session.userID;
  knex('jokes').fullOuterJoin('labels', 'jokes.label_id', 'labels.label_id').select('*').where('jokes.user_id', id)
  .then((jokesArr) => {
    res.render('../views/newPer.ejs', {
      onBits : false,
      userID : id,
      bits : jokesArr
    });
  });
});

// For posting the final details of a live set.
router.post('/live', (req, res) => {
  let performanceObj = req.body;
  console.log('This is the live performance post route', performanceObj);
  knex('performances').where('per_id', performanceObj.per_id).update({
    per_time : performanceObj.per_time,
    rating : performanceObj.rating,
    audio : performanceObj.audio,
  })
  .then(() => {
    return knex('jokes_performances').insert(performanceObj.performedValueArr);
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.error('Error inserting live per - ', err);
    res.sendStatus(500);
  })
});

//Creating New Performance
router.post('/new', (req, res, next) => {
  let id = req.session.userID;
  console.log(id)
  let newPer = req.body;
  if (newPer.bits) {
    newPer.bits = newPer.bits.map((bitString) => {
      return filterInt(bitString);
    });
  }
  console.log(newPer);
  let insertObj = {
    user_id : id,
    per_title : newPer.per_title,
    location : newPer.location,
    given_time : newPer.given_time,
    per_time : 0,
    date : newPer.date
  }
  knex('performances').insert(insertObj).returning('per_id')
  .then((perID) => {
    newPer.per_id = perID;
    res.send(newPer.per_id);
  });
})


// Rendering Performances
router.get('/', (req, res) => {
  let id = req.session.userID;
  return knex('performances')
    .select('performances.per_title', 'performances.date', 'performances.rating', 'performances.per_id')
    .where('performances.user_id', id)
    .then((persArr) => {
      console.log(persArr);
      res.render('../views/pers.ejs', {
        onBits : false,
        userID : id,
        pers: persArr
      });
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
})

// Authorization middleware. Reroutes to / if user isn't logged in.
router.get('/:perID' , (req, res, next) => {
  if (req.session.userID) {
    console.log('user is logged in');
    next();
  } else {
    console.log(`user is NOT logged in.`);
    res.redirect('/');
  }
});


//Rendering individual performance - Review Performance
router.get('/:perId', (req, res) => {
  const id = req.session.userID;
  const perId = filterInt(req.params.perId);

  knex('performances')
    .fullOuterJoin('jokes_performances', 'performances.per_id', 'jokes_performances.per_id')
    .fullOuterJoin('jokes', 'jokes_performances.joke_id', 'jokes.joke_id')
    .select('performances.per_title', 'performances.date', 'performances.per_id', 'performances.rating', 'performances.audio', 'jokes.joke_title', 'jokes.joke_id', 'jokes_performances.performed')
    .where({
      'performances.user_id': id,
      'performances.per_id': perId
    })
    .then((perObj) => {
      console.log(perObj);
      if (perObj.length === 0) {
        res.sendStatus(404);
      } else {
        res.render('../views/reviewPer.ejs', {
          onBits : false,
          userID : id,
          per: perObj
        });
      }
    })

    .catch((error) => {
      console.error('Error getting performance for review - ', error);
      res.sendStatus(500);
    });

});


//Updating Individual Performance - Review Performance
router.put('/:perId', (req, res) => {
  let performanceID = req.params.perId;
  let putObj = req.body;
  console.log(putObj);
  if (!putObj.rating) {
    knex('jokes_performances').where('per_id', putObj.performanceArr[0].per_id).del()
    .then(() => {
      return knex('jokes_performances').insert(putObj.performanceArr);
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Error while updating performance - ', err);
      res.sendStatus(500);
    });
  } else if (!putObj.performanceArr) {
    knex('performances').where('per_id', performanceID).update({
      rating : putObj.rating
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Error while updating performance - ', err);
      res.sendStatus(500);
    });
  } else {
    knex('performances').where('per_id', performanceID).update({
      rating : putObj.rating
    })
    .then(() => {
      return knex('jokes_performances').where('per_id', putObj.performanceArr[0].per_id).del();
    })
    .then(() => {
      return knex('jokes_performances').insert(putObj.performanceArr);
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Error while updating performance - ', err);
      res.sendStatus(500);
    });
  }
});

// The route for deleting a performance. Takes the performance ID.
router.delete('/:perID', (req, res) => {
  let deleteID = req.params.perID;
  knex('jokes_performances').where('per_id', deleteID).del()
  .then(() => {
    return knex('performances').where('per_id', deleteID).del();
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.error('Error while deleting - ', err);
    res.sendStatus(500);
  })

});



module.exports = router;
