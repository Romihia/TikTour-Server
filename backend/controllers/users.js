import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcrypt";

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
  const { firstName, lastName, email, location, rank } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, location, rank },
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
  const { firstName, lastName, dateOfBirth, location, picturePath } = req.body;
  console.log("firstName:", firstName, "lastName:", lastName, "dateOfBirth:", dateOfBirth, "location:", location, "profilePicture:", picturePath);

  try {
    //con picturePuth = picturePath.path
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { firstName, lastName, dateOfBirth, location, picturePath },
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
  const { newPassword } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: passwordHash },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE USER PICTURE */
export const updateUserPicture = async (req, res) => {
  const { id } = req.params;
  const { picturePath } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { picturePath },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
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