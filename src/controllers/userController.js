'user strict';

const mongoose  = require('mongoose');
const auth      = require('basic-auth');

const User = mongoose.model('User');

exports.authenticate = (req, res, next) => {
    return new Promise((resolve, reject) => {
        try {
            const credentials = auth(req);
            if (credentials && credentials.name && credentials.pass) {
                User.authenticate(credentials.name, credentials.pass, (error, user) => {
                    if (error || !user) {
                        const err = new Error('Wrong email or password.');
                        err.status = 401;
                        return next(err);
                    }
                    resolve(user);
                });
            } else {
                const err = new Error('Email and password are required');
                err.status = 401;
                return next(err);
            }
        } catch(err) {
            return next(err);
        }
    });
}

exports.getUser = (req, res, next) => {
    this.authenticate(req, res, next)
    .then(user => res.json(user));
};
exports.createUser = (req, res, next) => {
    if (req.body.emailAddress       &&
        req.body.fullName           &&
        req.body.password           &&
        req.body.confirmPassword
    ) {
        //confirm that user typed same password twice
        if (req.body.password !== req.body.confirmPassword) {
            const err = new Error('Passwords do not match');
            err.status = 400;
            return next(err);
        }

        // create object with form input
        const userData = {
            emailAddress:   req.body.emailAddress,
            fullName:       req.body.fullName,
            password:       req.body.password
        };
        // use schema's `create` method to insert document into Mongo
        User.create(userData, (error, user) => { 
            if (error) {
                const err = new Error(error.message);
                err.status = 400;
                return next(err);
            }
            res.status(201);
            res.setHeader('Location','/');
            res.end();
        });
    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
}

