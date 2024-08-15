import express from "express";
import multer from 'multer';
import { addPicture, removePicture } from "../controllers/picture.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
// Define allowed MIME types
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);  // Accept the file
    } else {
      cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);  // Reject the file
    }
  };
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter 
});

router.post('/upload', verifyToken, upload.single('picture'), addPicture);
router.delete('/delete/:fileId', verifyToken, removePicture);

export default router;
