'use strict';

module.exports = app => {
    const controller = require('../controllers/courseController');
    app.route('/api/courses')
        .get(controller.getCourses)                 // GET  courses
        .post(controller.createCourse);             // POST course

    app.route('/api/courses/:courseId')
        .get(controller.getCourse)                  // GET  course
        .put(controller.updateCourse);              // PUT  course

    app.route('/api/courses/:courseId/reviews')
        .post(controller.createReview)              // POST review
};
