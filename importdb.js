#!/usr/bin/env node

'use strict';

const {exec}    = require('child_process');
const mongoose  = require('mongoose');
const User      = require('./src/models/user');
const userData  = require('./seed-data/users.json');

mongoose.connect('mongodb://localhost:27017/course-api', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', () => console.error('connection error:', err));

db.dropDatabase();

User.create(userData, (error, users) => {
    console.log('importing courses and reviews...');
    exec('mongoimport --db course-api --collection courses --type=json --jsonArray --file seed-data/courses.json');
    exec('mongoimport --db course-api --collection reviews --type=json --jsonArray --file seed-data/reviews.json');

    if (error) console.log(error);
    else console.log('created users:', users)
    db.close(() => console.log('db connection closed'));
});
