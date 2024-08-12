import express from "express";
import multer from 'multer';
import { addPicture, removePicture } from "../controllers/picture.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', verifyToken, upload.single('picture'), addPicture);
router.delete('/delete/:fileId', verifyToken, removePicture);

export default router;
