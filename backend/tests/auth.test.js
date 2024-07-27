import request from 'supertest';
import assert from 'assert';
import app from '../index.js';

describe('Auth API', function() {
  this.timeout(5000); // Increase timeout to 5000ms

  it('should register a new user', (done) => {
    request(app)
      .post('/auth/register')
      .send({
        firstName: "max",
        lastName: "tes",
        email: "testEmail@testEmail.com",
        password: "123456789",
        location: "Ashkelon",
        username: "testUser",
        dateOfBirth: "1990-01-01",
        rank: "1",
        isVerified: true
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.email, "testEmail@testEmail.com");
        assert.strictEqual(res.body.username, "testUser");
        done();
      });
  });
});
