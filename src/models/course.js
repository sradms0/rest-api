'use strict';

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        auto: true
    },
    user: {
        type:   mongoose.Schema.Types.ObjectId,
        ref:    'User'   
    },
    title: {
        type:       String, 
        required:   true
    },
    description: {
        type:       String, 
        required:   true
    },
    estimatedTime: {
        type:       String
    },
    materialsNeeded: {
        type:       String
    },
    steps: {
        type: [{
            stepNumber: {
                type:       String
            },
            title: {
                type:       String,
                required:   true
            },
            description: {
                type:       String,
                required:   true
            }
        }]
    }, 
    reviews: {
        type: [{
            type:   mongoose.Schema.Types.ObjectId,
            ref:    'Review'   
        }]
    }
});

module.exports = mongoose.model('Course', CourseSchema);
