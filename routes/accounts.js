'use strict';

//Setting up knex
const env = 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);

//Setting up express routing
const express = require('express');
const router = express.Router();

//Setting up bcrypt
const bcrypt = require('bcrypt');


// filterInt - The function from MDN that confirms a particular value is actually an integer. Because parseInt isn't quite strict enough.
const filterInt = function(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
};

router.get('/login', (req, res) => {
  res.render('../views/login.ejs');
});

router.get('/create', (req, res) => {
  res.render('../views/createAccount.ejs');
});


////To be worked on after login paths set...
router.get('/:id/update', (req, res) => {

  res.render('../views/updateAccount.ejs');
});

router.post('/login', (req, res) => {
  let userObj = req.body;
  console.log(userObj);
  knex.select('*').from('users').where('user_name', userObj.email)
  .then((result) => {
    console.log(result);
    if (result.length===0) {
      return res.send('no account with that email');
    }
    return bcrypt.compare(userObj.password, result[0].password)
    .then ((res) => {
      if (res) {
        //Functionality if login works.
      } else {
        return res.sentStatus(401);
      }
    })
  })
});


router.post('/create', (req, res) => {
  console.log(req.body);
  let newUserObj = req.body;
  knex.select('user_name').from('users').where('user_name', newUserObj.user_name)
  .then((result) => {
    if (result.length !== 0) {
      return res.send('email exists');
    }
    return bcrypt.hash(newUserObj.password, 10, (err, hash) => {
      newUserObj.hashpw = hash;
      knex('users').insert({
        user_name : newUserObj.user_name,
        password : newUserObj.hashpw
      })
      .then(() => {
        res.sendStatus(200);
      });
    })
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  })

});



module.exports = router;
