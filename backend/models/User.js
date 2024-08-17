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
      max: 350,
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
      default: "https://firebasestorage.googleapis.com/v0/b/tiktour-79fa8.appspot.com/o/images%2Fuser.png?alt=media&token=f959d22e-4d99-495a-8be8-82d2483b30e5",
      required: false,
    },
    pictureName: {
      type: String,
      default: "user.png",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      required: false,
      default: ['66c0f78bd42d8e672a238f35'],
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    previousSearchingFilters: {
      type: Array,
      default: [],
    },
    notifications: {
      type: Array,
      default: [],
    },
    savedPosts: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
