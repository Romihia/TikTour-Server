import express from "express";
import {
  getUser,
  getUserFollowers,
  getUserFollowing,
  addRemoveFollow,
  updateUser,
  updatePassword,
  updateUserPicture,
  deleteUser
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/followers", verifyToken, getUserFollowers);
router.get("/:id/following", verifyToken, getUserFollowing);

/* UPDATE */
router.patch("/:id/:userId", verifyToken, addRemoveFollow);

/* UPDATE USER DETAILS */
router.patch("/:id", verifyToken, updateUser);

/* UPDATE USER PASSWORD */
router.patch("/:id/password", verifyToken, updatePassword);

/* UPDATE USER PICTURE */
router.patch("/:id/picture", verifyToken, updateUserPicture);

/* DELETE USER */
router.delete("/:id", verifyToken, deleteUser); // Added delete user route


export default router;
