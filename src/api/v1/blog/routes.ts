import express from "express";

import {
  getAllBlogs,
  getBlogById,
  filterBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "./controllers";
import isAuth from "../auth/middleware";

const router = express.Router();

router.get("", getAllBlogs);
router.get("/filter", filterBlogs);
router.get("/:id", getBlogById);
router.post("", isAuth, createBlog);
router.patch("/:id", isAuth, updateBlog);
router.delete("/:id", isAuth, deleteBlog);

export default router;
