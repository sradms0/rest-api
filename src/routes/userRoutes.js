'use strict';

module.exports = app => {
    const controller = require('../controllers/userController');
    app.route('/api/users')
        .get(controller.getUser)        // GET  users
        .post(controller.createUser)    // POST users
};
