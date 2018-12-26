'use strict';

module.exports = app => {
    const controller = require('../controllers/courseController');
    app.route('/api/courses')
        .get(controller.getCourses)     // GET  courses

    app.route('/api/courses/:id')
        .get(controller.getCourse)     // GET  course
};
