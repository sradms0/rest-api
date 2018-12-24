#!/usr/bin/env node

'use strict';

const {exec}    = require('child_process');
const mongoose  = require('mongoose');
const User      = require('./src/models/user');
const userData  = require('./seed-data/users.json');

mongoose.connect('mongodb://localhost:27017/course-api', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', () => console.error('connection error:', err));


const _import = () => {
    [
        'mongoimport --db course-api --collection courses --type=json --jsonArray --file seed-data/courses.json',
        'mongoimport --db course-api --collection reviews --type=json --jsonArray --file seed-data/reviews.json'
    ]
    .forEach(i => {
        exec(i, (err, stdout, stderr) => {
            if (err) console.log(stderr);
        });
    });
};

const createUsers = () => {
    User.create(userData, (error, users) => {
        if (error) console.log(error);
        else console.log('created:', users)
        db.close(() => console.log('db connection closed'));
    });
};

const main = () => {
    _import();
    createUsers();
}

main();
