import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      min: 1,
      max: 50,
      match: /^[A-Za-z]+$/
    },
    lastName: {
      type: String,
      required: false,
      min: 1,
      max: 50,
      match: /^[A-Za-z]+$/
    },
    email: {
      type: String,
      required: true,
      max: 150,
      unique: true,
      // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    username: {
      type: String,
      required: true,
      min: 1,
      max: 50,
      unique: true,
      match: /^[A-Za-z\d]+$/
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 50,
      // no work beacuse hashing
      // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]+$/
    },
    picturePath: {
      type: String,
      default: "user.png",
      required: false,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      required: false,
      default: [],
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    location: {
    type: String,
    required: false,
    min: 1,
    max: 50,
    match: /^[A-Za-z\s]+$/
    },
    rank:{
    type: String,
    required: false,
    default: "",
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
