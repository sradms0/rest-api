'use strict';

// load modules
const express       = require('express');
const jsonParser    = require('body-parser').json;
const morgan        = require('morgan');
const mongoose      = require('mongoose');
const User          = require('./models/user');
const Course        = require('./models/course');
const Review        = require('./models/review');

const app = express();

// establish database connection
mongoose.connect('mongodb://localhost:27017/course-api', { useNewUrlParser: true })
.then(
    () => console.log('mongodb connection established'),
    err => console.log(err.message)
);
const db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));
// use jsonParser for posts
app.use(jsonParser());

// TODO add additional routes here
const userRoutes    = require('./routes/userRoutes');
const courseRoutes  = require('./routes/courseRoutes');
userRoutes(app);
courseRoutes(app);

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
