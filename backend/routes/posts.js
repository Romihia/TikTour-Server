import express from "express";
import { getUserAndFollowingPosts, getFeedPosts, getUserPosts, likePost, dislikePost, deletePost, updatePost,createPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import multer from 'multer'; 

// Use multer memory storage to handle file uploads directly to Firebase
const upload = multer({
    limits: {
      fileSize: 20 * 1024 * 1024, // הגבלת גודל הקובץ (10MB בדוגמה זו)
    },
    fileFilter(req, file, cb) { // Add this line to see the filename
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
          return cb(new Error('Please upload a JPG, JPEG, or PNG file.'));
        }
        cb(null, true);
      },
  });

const router = express.Router();


/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get('/userAndFollowing/:userId', getUserAndFollowingPosts);


/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/dislike", verifyToken, dislikePost);

// Create and edit posts with multiple image uploads
router.post("/", verifyToken, upload.array('pictures', 10), createPost); // Allow up to 10 images
router.patch("/:id/edit", verifyToken, upload.array('pictures', 10), updatePost); // Allow up to 10 images 

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

export default router;
