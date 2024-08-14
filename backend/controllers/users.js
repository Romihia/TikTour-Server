import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcrypt";
import { dislikePost } from "./posts.js";
import { uploadImage, deleteImage } from '../utils/firebaseAPI.js';

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    console.log("\n\n req.params: " + JSON.stringify(req.params) + "\n\n");
    const { username } = req.params;
    
    // Use findOne to find a user by username
    const user = await User.findOne({ username: username });
    
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ _id: "UsernameNotFound", message: "User not found" });
    }
    res.status(200).json(user);

  } catch (err) {

    res.status(500).json({ message: err.message });
  }
};

export const getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    );
    const formattedFollowers = followers.map(
      ({ _id, firstName, lastName, location, picturePath }) => {
        return { _id, firstName, lastName, location, picturePath };
      }
    );
    res.status(200).json(formattedFollowers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const following = await Promise.all(
      user.following.map((id) => User.findById(id))
    );
    const formattedFollowing = following.map(
      ({ _id, firstName, lastName, location, picturePath }) => {
        return { _id, firstName, lastName, location, picturePath };
      }
    );
    res.status(200).json(formattedFollowing);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFollow = async (req, res) => {
  try {
    const { id, userId } = req.params;  // 'id' is the logged-in user, 'userId' is the user to follow/unfollow
    const user = await User.findById(id);
    const follower = await User.findById(userId);
    console.log(id);

    if (!user || !follower) {
      return res.status(404).json({ message: "User(s) not found" });
    }
    if(userId === id){
    return res.status(404).json({ message: "Its not possible to follow yourself." });
    }
    // Add or remove follower
    if (user.following.includes(userId)) {
      user.following = user.following.filter((curId) => curId !== userId);
      follower.followers = follower.followers.filter((curId) => curId !== id);
    } else {
      user.following.push(userId);
      follower.followers.push(id);

      const newNotification = {
        notificationType: "newFollower",
        text: user.username + " followed you.",
        followerId: user.id,
      };

      follower.notifications = follower.notifications.filter((notification) => {
        return JSON.stringify(notification) !== JSON.stringify(newNotification);
      });

      follower.notifications.push(newNotification);

      // Save the updated user document
      await follower.save();
    }

    await user.save();
    await follower.save();

    // Respond with the updated following list for the user
    const updatedFollowing = await Promise.all(
      user.following.map((id) => User.findById(id))
    );

    const formattedFollowing = updatedFollowing.map(
      ({ _id, firstName, lastName, location, picturePath }) => {
        return { _id, firstName, lastName, location, picturePath };
      }
    );

    res.status(200).json(formattedFollowing);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE USER DETAILS */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, location } = req.body;
  console.log("id:",id,"firstName:", firstName, "lastName:", lastName, "email:", email, "location:", location);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id ,
      { firstName, lastName, email, location},
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE USER Prompt */
export const updateUserPrompt = async (req, res) => {
  const { username } = req.params;
  const { firstName, lastName, dateOfBirth, location } = req.body;
  console.log("firstName:", firstName, "lastName:", lastName, "dateOfBirth:", dateOfBirth, "location:", location);

  try {
    
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { firstName, lastName, dateOfBirth, location },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE USER PASSWORD */
export const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the oldPassword matches the user's current password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: passwordHash },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating password:', error); // Log error for debugging
    res.status(500).json({ error: 'An error occurred while updating the password' });
  }
};


/* UPDATE USER PICTURE */
export const updateUserPicture = async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  //console.log(file);
  const newPictureName = file.originalname.split('.')[0] + id + '.' + file.originalname.split('.')[1];
  //console.log(newPictureName);
  try {
    // Upload the new image
    const responseUpload = await uploadImage(newPictureName, file.buffer);
    console.log(responseUpload);
    if (responseUpload) {
      // Fetch the existing user's picture path
      const user = await User.findById(id);
      const oldPicturePath = user.picturePath;

      // Delete the old image if it exists
      if (oldPicturePath) {
        const responseDelete = await deleteImage(oldPicturePath);
        if (!responseDelete) {
          throw new Error('Failed to delete old image');
        }
      }

      // Update the user's picture path in the database
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { picturePath: responseUpload },
        { new: true }
      );
      const updatedPostsPicture = await Post.findByIdAndUpdate(
        id,
        { picturePath: responseUpload },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } else {
      throw new Error('Failed to upload new image');
    }
  } catch (error) {
    // If there's an error, reset the user's picture path or respond with an error message
    await User.findByIdAndUpdate(id, { picturePath: 'https://firebasestorage.googleapis.com/v0/b/tiktour-79fa8.appspot.com/o/images%2Fuser.png?alt=media&token=f959d22e-4d99-495a-8be8-82d2483b30e5' }, { new: true });
    res.status(500).json({ error: error.message });
  }
};


/* DELETE USER */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTotalLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await Post.find({ userId: id });

    const totalLikes = posts.reduce((acc, post) => acc + post.likes.size, 0);
    res.status(200).json({ totalLikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTopLiker = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all posts of the user
    const posts = await Post.find({ userId: id });
    const likerCounts = {};

    // Process each post
    for (const post of posts) {
      // Process each liker of the post
      for (const liker of post.likes.keys()) {
        // Update the likerCounts dictionary
        if (likerCounts[liker]) {
          likerCounts[liker] += 1;
        } else {
          likerCounts[liker] = 1;
        }
      }
    }

    // Find the user with the maximum number of likes
    const topLikerId = Object.keys(likerCounts).reduce((a, b) =>
      likerCounts[a] > likerCounts[b] ? a : b
    );

    if (!topLikerId) {
      return res.status(404).json({ message: "No likers found" });
    }

    const topLiker = await User.findById(topLikerId);
    res.status(200).json({ topLiker, likeCount: likerCounts[topLikerId] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserRank = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await Post.find({ userId: id });

    // Determine the user's ranking based on the number of posts
    let rank = "Novice Explorer"; // Default rank
    const postCount = posts.length;
    if (postCount >= 50) rank = "Master Traveler";
    else if (postCount >= 40) rank = "Voyager";
    else if (postCount >= 30) rank = "Globetrotter";
    else if (postCount >= 20) rank = "Adventurer";
    else if (postCount >= 10) rank = "Wanderer";

    res.status(200).json({ rank });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

