import express from "express";
import {
  getUser,
  getUserFollowers,
  getUserFollowing,
  addRemoveFollower,
  updateUser,
  updatePassword,
  updateUserPicture,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/followers", verifyToken, getUserFollowers);
router.get("/:id/following", verifyToken, getUserFollowing);

/* UPDATE */
router.patch("/:id/:followerId", verifyToken, addRemoveFollower);

/* UPDATE USER DETAILS */
router.patch("/:id", verifyToken, updateUser);

/* UPDATE USER PASSWORD */
router.patch("/:id/password", verifyToken, updatePassword);

/* UPDATE USER PICTURE */
router.patch("/:id/picture", verifyToken, updateUserPicture);

export default router;
