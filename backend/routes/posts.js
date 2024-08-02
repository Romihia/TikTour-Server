import express from "express";
import { getUserAndFollowingPosts, getFeedPosts, getUserPosts, likePost, dislikePost, deletePost, updatePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get('/userAndFollowing/:userId', getUserAndFollowingPosts);


/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/dislike", verifyToken, dislikePost);
router.patch("/:id/edit", verifyToken, updatePost); // Added route for updating posts

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

export default router;
