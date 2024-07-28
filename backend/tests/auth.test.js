// import request from 'supertest';
// import assert from 'assert';
// import app from '../index.js';

// describe('Auth API', function() {
//   this.timeout(10000); // Increase timeout to 5000ms

//   let userId;
//   let token;
//   const userPayload = {
//     firstName: "max",
//     lastName: "tes",
//     email: "testEmail@testEmail.com",
//     password: "123456789",
//     location: "Ashkelon",
//     username: "testUser",
//     dateOfBirth: "1990-01-01",
//     rank: "1",
//     isVerified: true
//   };

//   it('should register a new user', (done) => {
//     request(app)
//       .post('/auth/register')
//       .send(userPayload)
//       .expect(201)
//       .end((err, res) => {
//         if (err) return done(err);
//         assert.strictEqual(res.body.email, userPayload.email);
//         assert.strictEqual(res.body.username, userPayload.username);
//         userId = res.body._id;

//         // Log in to get the token
//         request(app)
//           .post('/auth/login')
//           .send({ identifier: userPayload.email, password: userPayload.password })
//           .expect(200)
//           .end((err, res) => {
//             if (err) return done(err);
//             token = res.body.token;
//             done();
//           });
//       });
//   });

//   it('should retrieve the same user', (done) => {
//     request(app)
//       .get(`/users/${userId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         assert.strictEqual(res.body.email, userPayload.email);
//         assert.strictEqual(res.body.username, userPayload.username);
//         done();
//       });
//   });

//   it('should delete the user', (done) => {
//     request(app)
//       .delete(`/users/${userId}`)
//       .set('Authorization', 'Bearer ' + token) // Assuming you have a valid token from login
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         request(app)
//           .get(`/users/${userId}`)
//           .set('Authorization', 'Bearer ' + token) // Assuming you have a valid token from login
//           .expect(404)
//           .end(done);
//       });
//   });
// });