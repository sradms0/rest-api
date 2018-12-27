'user strict';

const mongoose          = require('mongoose');
const {authenticate}    = require('../controllers/userController');

const User   = mongoose.model('User');
const Course = mongoose.model('Course');
const Review = mongoose.model('Review');

// for possibility of when model validation errors occurr
const modelErrorCheck = (error, next) => {
    if (error) {
        error.status = 400;
        return next(error);
    }
};

exports.getCourses = (req, res, next) => {
    authenticate(req, res, next)
    .then(user => {
        // display only _id and title
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
    authenticate(req, res, next)
    .then(user => {
        Course.findById(req.params.courseId)
        // use deep population to to not show the user's password
        .populate({path:'user', select: 'fullName'})
        .populate({path:'reviews'})
        .exec((error, course) => {
            if (error) {
                const err = new Error(`Unable to find course by id: ${req.params.courseId}`);
                err.status = 404;
                return next(err);
            }
            return res.json(course);
        });
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
exports.updateCourse = (req, res, next) => {
    authenticate(req, res, next)
    .then(user => {
        // find document by id and update from fields
        Course.findByIdAndUpdate(req.params.courseId, {$set: req.body})
        .exec((error, course) => {
            modelErrorCheck(error, next);

            res.status(204);
            res.end();
        });
    });
};
exports.createReview = (req, res, next) => {
    authenticate(req, res, next)
    .then(user => {
        if (user._id.toString() === req.body.user) {
            const err = new Error('Unable to review own course.');
            err.status = 400;
            return next(err);
        }
        // find course to review
        Course.findById(req.params.courseId)
        .exec((error, course) => {
            modelErrorCheck(error, next);

            // create the review
            Review.create(req.body, (error, review) => {
                modelErrorCheck(error, next);

                // add it, and save
                course.reviews.push(review);
                course.save(error => {
                    modelErrorCheck(error, next);
                    res.setHeader('Location', `/api/courses/${req.params.courseId}`);
                    res.status(201);
                    res.end();
                });
            });
        });
    });
};

