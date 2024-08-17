import User from "../models/User.js";
import Post from "../models/Post.js";

export const saveUnsavePost = async (req, res) => {
    try {  
      const { userId, postId } = req.params;
      const user = await User.findById(userId).populate('savedPosts');
      const post = await Post.findById(postId);
  
      if (!user || !post) {
        return res.status(404).json({ message: "User or post not found" });
      }
  
      const postIndex = user.savedPosts.findIndex(savedPost => savedPost === postId);
      let isSaved
      let responseToUser = "";
      if (postIndex > -1) {
        responseToUser = "Post was unsaved.";
        isSaved=false;
        user.savedPosts.splice(postIndex, 1);
      } else {
        responseToUser = "Post was saved.";
        isSaved=true;
        user.savedPosts.push(postId);
      }
  
      await user.save();

      res.status(200).json({isSaved:isSaved, message: responseToUser });
    } catch (err) {
      console.error("Error in saveUnsavePost:", err);
      res.status(500).json({ message: err.responseToUser });
    }
  };
  // Utility function to fetch posts and handle missing posts
    const fetchPostsByIds = async (postIds) => {
        try {
        const postFetchPromises = postIds.map(async (postId) => {
            try {
            const post = await Post.findById(postId);
            return post; // Return the resolved post if found
            } catch {
            // Return null if post is not found
            return null;
            }
        });
    
        const posts = await Promise.all(postFetchPromises);
    
        return posts.filter(post => post !== null); // Filter out null values
        } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow error for the caller to handle
        }
    };
    
    // Controller function to get saved posts and handle missing posts
    export const getSavedPosts = async (req, res) => {
        try {
        const { userId } = req.params;
        const user = await User.findById(userId);
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        const savedPostIds = user.savedPosts;
    
        // Fetch posts and handle missing posts
        const fetchedPosts = await fetchPostsByIds(savedPostIds);
    
        // Determine missing post IDs
        const missingPostIds = savedPostIds.filter(id => !fetchedPosts.some(post => post._id.toString() === id.toString()));
    
        // Remove missing post IDs from the user's savedPosts
        if (missingPostIds.length > 0) {
            user.savedPosts = user.savedPosts.filter(id => !missingPostIds.includes(id));
            await user.save();
        }
    
    
        res.status(200).json({ savedPosts: fetchedPosts });
        } catch (err) {
        console.error("Error in fetching saved posts:", err);
        res.status(500).json({ message: "An error occurred while fetching saved posts." });
        }
    };
    