import express from "express";

import {
  getUsersByAttributes,
  getPostsByAttributes,
  updateUserSearchingFiltersHistory,
  getUserSearchingFiltersHistory,
  removeSearchFilterFromHistory,
  getContentByFreeTextSearch,
} from "../controllers/search.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/getUsers", verifyToken, getUsersByAttributes);
router.get("/getPosts", verifyToken, getPostsByAttributes);
router.get("/:id/getUserSearchingFiltersHistory", verifyToken, getUserSearchingFiltersHistory);
router.get("/getContentByFreeTextSearch", verifyToken, getContentByFreeTextSearch);

router.post("/updateUserSearchingFiltersHistory", verifyToken, updateUserSearchingFiltersHistory);
router.post("/removeSearchFilterFromHistory", verifyToken, removeSearchFilterFromHistory);



export default router;
