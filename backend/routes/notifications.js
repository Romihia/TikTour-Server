import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { 
    getUserNotifications,
    deleteNotification,
    clearNotifications
 } from "../controllers/notifications.js";

const router = express.Router();

router.get('/:userId/getUserNotifications', verifyToken, getUserNotifications);
router.post('/deleteNotification', verifyToken, deleteNotification);
router.post('/clearNotifications', verifyToken, clearNotifications);


export default router;
