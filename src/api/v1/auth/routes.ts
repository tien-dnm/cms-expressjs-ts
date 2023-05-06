import express from "express";
import { accessToken, refreshToken } from "./controllers";

const router = express.Router();

router.post("/access-token", accessToken);
router.post("/refresh-token", refreshToken);

export default router;
