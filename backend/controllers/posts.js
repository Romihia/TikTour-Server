import Post from "../models/Post.js";
import User from "../models/User.js";
import path from 'path';
import fs from 'fs';

// Update a post
export const updatePost = async (req, res) => {
  console.log("req.body: ", req.body);
  console.log("res.body: ", res.body);
  try {
    const id = req.body.id;
    const { userId, description, location, hashtags } = req.body;

    console.log("\n\n\n\n\n\n\nid: " + id);

    // Find the post to update
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the authenticated user is the owner of the post
    if (post.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Handle image update
    let picturePath;
    if (req.body) {
      // If a new image is uploaded, update the picturePath
      picturePath = req.body.picturePath;
      
      // Optionally, delete the old image from the server
      const oldPicturePath = post.picturePath;
      if (oldPicturePath) {
        fs.unlinkSync(path.join('public/assets', oldPicturePath));
      }
    } else {
      // Retain the existing picturePath if no new image is uploaded
      picturePath = post.picturePath;
    }

    // Update the post with new data
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        description: description || post.description,
        location: location || post.location,
        hashtags: hashtags || post.hashtags,
        picturePath: picturePath || post.picturePath,
      },
      { new: true }
    );
    console.log("Updated post: "+updatedPost);

    
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, location, hashtags } = req.body;
    const user = await User.findById(userId);
    
    // Handle image file if present
    const picturePath = req.file ? req.file.filename : '';

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.username,
      location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      dislikes: {},
      hashtags,
    });

    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isDisLiked = post.dislikes.get(userId);

    if (isDisLiked) {
      post.dislikes.delete(userId);
    } else {
      post.dislikes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { dislikes: post.dislikes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    const posts = await Post.find();
    res.status(200).json({ message: 'Post deleted successfully', posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to get posts from the current user and the users they follow
export const getUserAndFollowingPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the current user
    const currentUser = await User.findById(userId);

    // Get the list of user IDs the current user is following
    const followingIds = currentUser.following;

    // Add the current user's ID to the list
    followingIds.push(userId);

    // Fetch posts from the current user and users they follow
    const posts = await Post.find({ userId: { $in: followingIds } }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



