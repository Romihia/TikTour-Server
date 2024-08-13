import express from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  saveUnsavePost,
  getSavedPosts
} from "../controllers/save.js";

const router = express.Router();

router.get("/:userId/:postId/saveUnsavePost", verifyToken, saveUnsavePost);
router.get("/:userId/getSavedPosts", verifyToken, getSavedPosts);


export default router;
