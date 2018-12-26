'use strict';

const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');

const UserSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        auto: true
    },
    fullName: {
        type:       String,
        required:   true
    },
    emailAddress: {
        type:       String,
        unique:     true,
        required:   true,
        validate:   {
            validator:  (email) => /\S+@\S+\.\S+/.test(email),
            message:    (props) => `${props.value} invalid email.`
        }
    },
    password: {
        type:       String,
        required:   true
    }
});

// authenticate input against database document
UserSchema.statics.authenticate = function(emailAddress, password, callback) {
    this.findOne({ emailAddress: emailAddress })
    .exec((err, user) => {
        if (err) return callback(err);
        else if (!user) {
            const err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }

        //add once done testing pre-loaded data and passwords become hashed
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) return callback(null, user);
            return callback();
        })
    });
}

// hash password before saving to db
UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

module.exports = mongoose.model('User', UserSchema);
