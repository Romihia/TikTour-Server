import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: false,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      max: 20,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    picturePath: {
      type: String,
      required: false,
      default: "",
    },
    friends: {
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
    default: "",
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
