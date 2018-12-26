'user strict';

const mongoose          = require('mongoose');
const {authenticate}    = require('../controllers/userController');

const User   = mongoose.model('User');
const Course = mongoose.model('Course');

exports.getCourses = (req, res, next) => {
    authenticate(req, res, next)
    .then(user => {
        Course.find(
            {user: user._id}, 
            {_id: true, title: true}
        )
        .exec((error, courses) => {
            if (error) return next(error);
            return res.json(courses);
        });
    });
};
exports.getCourse = (req, res, next) => {
    Course.findById(req.params.id)
    .populate('user')
    .populate('reviews')
    .exec((error, course) => {
        // TODO add custom err message soon
        if (error) return next(error);
        return res.json(course);
    });
};
exports.createCourse = (req, res, next) => {
    authenticate(req, res, next)
    .then(user => {
        if (req.body.title          &&
            req.body.description    &&
            req.body.steps
        ) {
            // create object with form input
            const courseData = {
                title:          req.body.title,
                description:    req.body.description,
                user:           user._id,
                steps:          req.body.steps
            };

            // use schema's `create` method to insert document into Mongo
            Course.create(courseData, (error, course) => {
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
            const err = new Error('required fields: title, description, user, steps');
            err.status = 400;
            return next(err);
        }
    });
};
