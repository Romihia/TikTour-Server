import User from "../models/User.js";
import Post from "../models/Post.js";



export const getUsersByAttributes = async (req, res) => {
  try {
    // res.send("Hello");
    
    // Extract query parameters to use as search criteria
    const queryAttributes = { ...req.query };

    console.log("query" , queryAttributes)
    
    // Use find to get all users that match the query attributes
    const users = await User.find(queryAttributes);
    
    if (!users.length) {
      console.log("No users found");
      return res.status(404).json({ _id: "UsersNotFound", message: "No users found" });
    }
    
    console.log("users:" , users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getPostsByAttributes = async (req, res) => {
  try {
    // res.send("Hello");
    
    // Extract query parameters to use as search criteria
    const queryAttributes = { ...req.query };

    console.log("query" , queryAttributes)
    
    // Use find to get all posts that match the query attributes
    const posts = await Post.find(queryAttributes);
    
    if (!posts.length) {
      console.log("No posts found");
      return res.status(404).json({ _id: "PostsNotFound", message: "No posts found" });
    }
    
    console.log("posts:" , posts);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







