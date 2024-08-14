import express from "express";
import multer from 'multer';
import {
  getUser,
  getUserFollowers,
  getUserFollowing,
  addRemoveFollow,
  updateUser,
  updatePassword,
  updateUserPicture,
  deleteUser,
  getTotalLikes,
  getTopLiker,
  getUserRank,
  updateUserPrompt,
  getUserByUsername,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:username/getByUsername", verifyToken, getUserByUsername);
// router.get("/getByAttributes", verifyToken, getUsersByAttributes);

router.get("/:id/followers", verifyToken, getUserFollowers);
router.get("/:id/following", verifyToken, getUserFollowing);
router.get("/:id/totalLikes", verifyToken, getTotalLikes);
router.get("/:id/topLiker", verifyToken, getTopLiker);

/* UPDATE USER DETAILS IN PROMPT */
router.post("/prompt/:username", verifyToken, updateUserPrompt);

/* UPDATE */
router.patch("/:id/:userId", verifyToken, addRemoveFollow);

/* UPDATE USER PASSWORD */
router.post("/:id/password", verifyToken, updatePassword);
/* UPDATE USER DETAILS */
router.post("/:id", verifyToken, updateUser);

/* UPDATE USER PICTURE */
router.post("/:id/picture", verifyToken, upload.single('picture') , updateUserPicture);

/* DELETE USER */
router.delete("/:id", verifyToken, deleteUser); 


// routes/users.js
router.get("/:id/rank", verifyToken, getUserRank);


export default router;
