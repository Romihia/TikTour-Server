import express from "express";
import {getUserAndFollowingPosts, getFeedPosts, getUserPosts, likePost, dislikePost, deletePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get('/userAndFollowing/:userId', getUserAndFollowingPosts);


/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/dislike", verifyToken, dislikePost);

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

export default router;
