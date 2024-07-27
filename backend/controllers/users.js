import User from "../models/User.js";
import bcrypt from "bcrypt";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
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
export const addRemoveFollower = async (req, res) => {
  try {
    const { id, followerId } = req.params;
    const user = await User.findById(id);
    const follower = await User.findById(followerId);

    if (user.followers.includes(followerId)) {
      user.followers = user.followers.filter((id) => id !== followerId);
      follower.following = follower.following.filter((id) => id !== id);
    } else {
      user.followers.push(followerId);
      follower.following.push(id);
    }
    await user.save();
    await follower.save();

    const updatedFollowers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    );
    const formattedFollowers = updatedFollowers.map(
      ({ _id, firstName, lastName, location, picturePath }) => {
        return { _id, firstName, lastName, location, picturePath };
      }
    );

    res.status(200).json(formattedFollowers);
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
