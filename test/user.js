const mongoose  = require('mongoose');
const User      = require('../src/models/user');
const chai      = require('chai')
const chaiHttp  = require('chai-http')
const server    = require('../src/index')

const should = chai.should();
chai.use(chaiHttp);

// test that successful authorization returns correct document
describe('GET /api/users', () => {
    it('it should return the corresponding user document', done => {
        chai.request(server)
        .get('/api/users')
        .auth('joe@smith.com', 'password')
        .end((err, res) => {
            res.body.should.be.a('object');
            res.body.should.have.property('fullName').eql('Joe Smith');
            res.body.should.have.property('emailAddress').eql('joe@smith.com');
            done();
        });
    });
});

// test that non-authorized course requesting returns 401 (along with error)
describe('GET /api/courses/:courseId', () => {
    it('it should return a 401 status error', done => {
        chai.request(server)
        .get('/api/courses/57029ed4795118be119cc440')
        .end((err, res) => {
            res.should.have.status(401);
            done();
        });
    });
});



