import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUser,
  updatePassword,
  updateUserPicture,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

/* UPDATE USER DETAILS */
router.patch("/:updateuser", verifyToken, updateUser);

/* UPDATE USER PASSWORD */
router.patch("/:id/password", verifyToken, updatePassword);

/* UPDATE USER PICTURE */
router.patch("/:id/picture", verifyToken, updateUserPicture);

export default router;
