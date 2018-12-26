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
