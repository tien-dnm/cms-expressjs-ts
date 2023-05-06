import express from "express";
import authRouter from "./auth/routes";
import userRouter from "./user/routes";
import blogRouter from "./blog/routes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/blog", blogRouter);

export default router;
