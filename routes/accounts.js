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

router.get('/login', (req, res) => { // Sends the basic login page.
  res.render('../views/login.ejs');
});

router.get('/logout', (req, res) => { // Clears the cookie and redirects to the landing page.
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/');
  })
});


router.get('/create', (req, res) => { // Sends the create account page.
  res.render('../views/createAccount.ejs');
});

// Middleware to check and see if user is logged in. Passes them on to the regular update route if they are. Otherwise, redirects to /
router.get('/update', (req, res, next) => {
  if (req.session.userID) {
    next()
  } else {
    res.redirect('/');
  }
});

// Checks the user ID of user, pulls the information from database for user with that ID, and sends it to the updateAccount.ejs for rendering.
router.get('/update', (req, res) => {
  knex('users').where('id', req.session.userID).select('user_name', 'photo_url')
  .then((resultArr) => {
    console.log('The results of search - ', resultArr);
    return res.render('../views/updateAccount.ejs', {account : resultArr[0]});
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});


// The page for getting the user logged in.
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
    .then ((loginCheck) => {
      if (loginCheck) { // If the passwords match, login and redirect to their bits page.
        res.cookie('user', '1', { maxAge: 900000, httpOnly: true });
        req.session.userID = result[0].id;
        console.log('Passwords Match ', req.session);
        return res.redirect(`/bits/${req.session.userID}`);
      } else { // If passwords don't match, send a 401.
        return res.sendStatus(401);
      }
    })
  })
});

// For creating the user account from a POST request to /accounts/create
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

// Middleware to check and see if user is logged in. Passes them on to the update PUT route if they are. Otherwise, sends 401.
router.put('/update', (req, res, next) => {
  if (req.session.userID) {
    next()
  } else {
    res.sendStatus(401);
  }
});

// For PUT requests to /accounts/update - Will update the user's account with the information provided.
router.put('/update', (req, res) => {
  let updateObj = req.body;
  if (updateObj.password) { // Checking password first because it's the biggest async task.
    bcrypt.hash(updateObj.password, 10, (err, hash) => {
      updateObj.hashpw = hash;
      knex('users').where('id', req.session.userID).update({
        password : updateObj.hashpw // Putting the new PW in the DB.
      })
      .then(() => { // After entering PW, checking on email update
        if (updateObj.user_name) {
          return knex('users').where('id', req.session.userID).update({
            user_name : updateObj.user_name // Putting the new email in the DB.
          });
        } else { // If that wasn't updated, returning empty to move on to next.
          return;
        }
      })
      .then(() => { // After entering email, checking on photo update
        if (updateObj.photo_url) {
          return knex('users').where('id', req.session.userID).update({
            photo_url : updateObj.photo_url // Putting the new photo url in the DB.
          });
        } else { // If that wasn't updated, returning empty to move on to next.
          return;
        }
      })
      .then(() => {
        console.log('send success');
        res.send('success');
      })
      .catch((error) => { // Catching any error.
        console.error('Error inserting update - ', error);
        res.sendStatus(500);
      });
    });
  } else { // Same logic as above, but if there was no password entered.
    if (updateObj.user_name) { // First check for username.
      knex('users').where('id', req.session.userID).update({
        user_name : updateObj.user_name // Putting the new email in the DB.
      })
      .then(() => { // After inserting username, check to see about a photo url.
        if (updateObj.photo_url) { // If there's a photo url, insert it.
          return knex('users').where('id', req.session.userID).update({
            photo_url : updateObj.photo_url // Putting the new photo url in the DB.
          })
        } else { // If there's no photo URL, move on.
          return;
        }
      })
      .then(() => { // Things are updated, send success.
        console.log('send success');
        res.send('success');
      });
    } else if (updateObj.photo_url) { // If there's no email update, update the photo if there is one.
      knex('users').where('id', req.session.userID).update({
        photo_url : updateObj.photo_url // Putting the new photo url in the DB.
      })
      .then(() => { // Once photo is updated, send success.
        console.log('send success');
        res.send('success');
      });
    }
  }
});



module.exports = router;
