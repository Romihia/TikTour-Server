import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      max: 50,
    },
    lastName: {
      type: String,
      required: false,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 100,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 50,
    },
    picturePath: {
      type: String,
      default: "user.png",
      required: false,
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
