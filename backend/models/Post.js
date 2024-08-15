import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    sharedById: {
      type: String,
      defaultValue: "",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: [String],
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    dislikes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    hashtags: {
      type: [], 
      default: [], 
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
