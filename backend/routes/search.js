import express from "express";

import {
  getUsersByAttributes,
  getPostsByAttributes,
} from "../controllers/search.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/getUsers", verifyToken, getUsersByAttributes);
router.get("/getPosts", verifyToken, getPostsByAttributes);




export default router;
