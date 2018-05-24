'use strict';

// Setting up express, express-session, path, body parser, and passport.
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 8888;

// Getting dotenv so sensitive info on production can be in a .env file.
require('dotenv').config();

//Setting up knex
const env = process.env.ENVIORNMENT || 'development';
const config = require('./knexfile.js')[env];
const knex = require('knex')(config);

// Requiring the code for the accounts, jokes, and perofmrnaces routes.
const accountsRoute = require('./routes/accounts.js');
const bitsRoute = require('./routes/bits.js');
const performancesRoute = require('./routes/performances.js');
const recordRoute = require('./routes/record.js');

// Disabling the x-powered-by: Express header, for security.
app.disable('x-powered-by');

// Middleware. Body-Parser and Morgan.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('short'));


// Middleware. Setting up session.
app.use(session({
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    secure : false
  }
}));

// Telling the application that when the status route is used, it will look in the public folder for resources.
app.use('/static', express.static(path.join(__dirname, 'public')));

// Telling our applications where the template files are located.
app.set('views', './views');

// Telling express what view engine we're using.
app.set('view engine', 'ejs');

app.use('/', (req, res, next) => {
  if (req.session) {
    console.log('There is a req.session - ', req.session.id);
    knex('sessions').where('session_id', req.session.id).select('*')
    .then((results) => {
      if (results.length===1) {
        req.session.userID = results[0].user_id;
      }
      next();
    });
  } else {
    console.log('There is no req.session.');
    next();
  }
});

app.use('/accounts', accountsRoute);
app.use('/bits', bitsRoute);
app.use('/performances', performancesRoute);
app.use('/record', recordRoute);

// Middleware if user is logged in, passing them to /bits if they are.
app.get('/', (req, res, next) => {
  if (req.session.userID) {
    res.redirect(`/bits`);
  } else {
    next();
  }
});

// Rendering the EJS for the landing page for a request to root.
app.get('/', (req,res) => {
  res.render(path.join(__dirname, 'views/index.ejs'), {
  });
});


// Turning on listening on the specified port.
app.listen(port, () => {
  console.log('Listening on port', port);
});


module.exports = app;
