import express from "express";

import {
  getAllPosts,
  getPostById,
  filterPosts,
  createPost,
  updatePost,
  deletePost,
} from "./controllers";
import isAuth from "../auth/middleware";

const router = express.Router();

router.get("", getAllPosts);
router.get("/filter", filterPosts);
router.get("/:id", getPostById);
router.post("", createPost);
router.patch("/:id", isAuth, updatePost);
router.delete("/:id", isAuth, deletePost);

export default router;
