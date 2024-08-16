import User from "../models/User.js";

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    // Fetch the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Send the user's notifications array
    res.status(200).json({notifications: user.notifications});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
  const { userId, notificationIndexToRemove } = req.body;

  const user = await User.findById(userId);

  // Remove the notification by index.
  user.notifications.splice(notificationIndexToRemove, 1);

    await user.save();
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const clearNotifications = async (req, res) => {
  try {
  const { userId } = req.body;

  const user = await User.findById(userId);

  // Remove the notification by index.
  user.notifications = [];
  await user.save();
  res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

