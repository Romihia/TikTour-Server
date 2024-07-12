// import { expect } from 'chai';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();
// const mongoUrl = process.env.MONGO_URL;


// describe('MongoDB Connection', () => {
//   before((done) => {
//     mongoose.connect(mongoUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }, (err) => {
//       if (err) {
//         console.error('MongoDB connection error:', err);
//       }
//       done();
//     });
//   });

//   after((done) => {
//     mongoose.connection.close(() => done());
//   });

//   it('should connect to MongoDB', () => {
//     expect(mongoose.connection.readyState).to.equal(1); // 1 means connected
//   });
// });
