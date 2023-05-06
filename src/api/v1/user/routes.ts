import express from "express";
import isAuth from "../auth/middleware";

import {
  getAllUsers,
  getUserById,
  filterUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./controllers";

const router = express.Router();
router.get("", isAuth, getAllUsers);
router.get("/filter", isAuth, filterUsers);
router.get("/:id", isAuth, getUserById);
router.post("", isAuth, createUser);
router.patch("/:id", isAuth, updateUser);
router.delete("/:id", isAuth, deleteUser);
export default router;
