import { hash } from "bcrypt";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { generateUniqueFileName, uploadImage } from "../utils/firebaseAPI.js";

/* CREATE */
export const createPost = async (req, res) => {
  const newPictureNames = []; // To track uploaded images for rollback on failure
  let hashtags = [];
  try {
    const { userId, sharedById, description, location, picturePath } = req.body;
    if (!Array.isArray(req.body.hashtags)) {
      // Parse hashtags as an array
      if (req.body.hashtags) {
        try {
          hashtags = JSON.parse(req.body.hashtags);
        } catch (err) {
          console.error("Error parsing hashtags: ", err);
          return res.status(400).json({ message: "Invalid format for hashtags." });
        }
      }
    }else{
      hashtags = req.body.hashtags;
    }
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found`", userId);
      return res.status(404).json({ message: "User not found." });
    }

    // Handle multiple image uploads
    const uplaodPicturePaths = [];
    if (req.files) {
      for (const file of req.files) {
        const newPictureName = generateUniqueFileName(file, Date.now());
        newPictureNames.push(newPictureName);
        const imageUrl = await uploadImage(newPictureName, file.buffer); 
        uplaodPicturePaths.push(imageUrl); 
      }
    }

    if (picturePath) {
      uplaodPicturePaths.push(...picturePath); // Append any existing picture paths
    }

    const newPost = new Post({
      userId,
      sharedById,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.username,
      location,
      description,
      userPicturePath: user.picturePath,
      picturePath: uplaodPicturePaths,
      likes: {},
      dislikes: {},
      hashtags,
    });

    await newPost.save();

    // Notify the author of the shared post.
    if (sharedById) {
      const sharingUser = await User.findById(sharedById);
      if (sharingUser) {
        const newNotification = {
          notificationType: "share",
          text: `${sharingUser.username} shared your post.`,
          originalPostId: newPost._id,
          userId: sharedById,
        };

        user.notifications = user.notifications.filter(
          (notification) => JSON.stringify(notification) !== JSON.stringify(newNotification)
        );

        user.notifications.push(newNotification);
        await user.save();
      }
    }

    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (err) {
    // Rollback: Delete uploaded images if post creation fails
    if (newPictureNames.length > 0) {
      try {
        for (const pictureName of newPictureNames) {
          await deleteImage(pictureName);
        }
      } catch (deleteErr) {
        console.error("Error deleting images after failed post creation: ", deleteErr);
      }
    }
    const posts = await Post.find();
    res.status(409).json(posts,{ message: err.message });
    console.error("Error on creating post: ", err);
  }
};


// Update a post
export const updatePost = async (req, res) => {
  const newPictureNames = [];
  try {
    const id = req.params.id;
    const { userId, description, location } = req.body;
    let hashtags = [];
    
    if (req.body.hashtags) {
      try {
        hashtags = JSON.parse(req.body.hashtags);
      } catch (err) {
        console.error("Error parsing hashtags: ", err);
        return res.status(400).json({ message: "Invalid format for hashtags." });
      }
    }
    let { imagesToRemove } = req.body;
     // New param to track images to remove
    if (Array.isArray(imagesToRemove)) {
      console.log("imagesToRemove is an array");
    } else {
      imagesToRemove=[imagesToRemove];
      console.log("imagesToRemove is not an array");
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Handle image removal (if imagesToRemove is passed)
  
    let picturePaths = post.picturePath; // Existing pictures
    
    for (const imageUrl of imagesToRemove) {
      // Remove from Firebase
      //await deleteImage(imageUrl.split('/').pop()); // Deletes from Firebase
      // Remove from the array
      picturePaths = picturePaths.filter((url) => url !== imageUrl);
    }
    

    // Handle image upload (if new images are uploaded)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const newPictureName = generateUniqueFileName(file, Date.now());
        newPictureNames.push(newPictureName);
        const imageUrl = await uploadImage(newPictureName, file.buffer); // Upload to Firebase
        picturePaths.push(imageUrl); // Add new image URLs to existing list
      }
    }

    // Update the post with new data
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        description: description || post.description,
        location: location || post.location,
        hashtags: hashtags || post.hashtags,
        picturePath: picturePaths, // Update with new and existing image URLs
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    // Delete the uploaded images if creation fails
    if (newPictureNames.length > 0){
      try {
        // Delete the images from Firebase
        for (const PictureNameToDelete of newPictureNames) {
          await deleteImage(PictureNameToDelete);
        }
      } catch (err) {
        console.log("Error on deleting images after failed post creation.");
      }
    }
    res.status(500).json({ message: err.message });
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
    const allPosts = await Post.find().lean();
    const userPosts = allPosts.filter((post) => post.userId === userId || post.sharedById === userId);
    res.status(200).json(userPosts);
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
    const isDisLiked = post.dislikes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
      if (isDisLiked){
        post.dislikes.delete(userId);
      }
      const currentUser = await User.findById(userId);
      const userToNotify = await User.findOne({"username": post.userName});

      const newNotification = {
        notificationType: "like",
        text: currentUser.username + " liked your post.",
        postId: post.id
      };

      userToNotify.notifications = userToNotify.notifications.filter((notification) => {
        if (
          notification.text === newNotification.text &&
          notification.postId === newNotification.postId
          )
          return false;
        return true;
      });

      userToNotify.notifications.push(newNotification);
      await userToNotify.save();
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes, dislikes: post.dislikes},
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
    const isLiked = post.likes.get(userId);

    if (isDisLiked) {
      post.dislikes.delete(userId);
    } else {
      post.dislikes.set(userId, true);
      if (isLiked){
        post.likes.delete(userId);
      }
      const currentUser = await User.findById(userId);
      const userToNotify = await User.findOne({"username": post.userName});

      const newNotification = {
        notificationType: "dislike",
        text: currentUser.username + " disliked your post.",
        postId: post.id
      };

      userToNotify.notifications = userToNotify.notifications.filter((notification) => {
        if (
          notification.text === newNotification.text &&
          notification.postId === newNotification.postId
          )
          return false;
        return true;
      });
      userToNotify.notifications.push(newNotification);
      await userToNotify.save();
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { dislikes: post.dislikes, likes: post.likes},
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// DELETE A POST
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    // Delete associated images from Firebase
    // if (post.picturePath && post.picturePath.length > 0) {
    //   for (const imageUrl of post.picturePath) {
    //     await deleteImage(imageUrl.split('/').pop()); // Delete from Firebase
    //   }
    // }

    res.status(200).json({ message: 'Post and associated images deleted successfully',post });
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
    const posts = await Post.find({
      $or: [
        { userId: { $in: followingIds } },
        { sharedById: { $in: followingIds } }
      ]
    }).sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



