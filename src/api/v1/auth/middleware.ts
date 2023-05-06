import { NextFunction, Request, Response } from "express";
// import User from "../user/model";
import { decodeToken } from "./methods";
import { JwtPayload } from "jsonwebtoken";
// const User = require("../user/model");
// const { decodeToken } = require("./methods");

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization") || "";

  const accessTokenFromHeader = authHeader.replace("Bearer ", "");

  if (!accessTokenFromHeader) {
    return res.status(401).send("Invalid access token.");
  }

  const verified = (await decodeToken(accessTokenFromHeader)) as JwtPayload;

  if (!verified) {
    return res.status(401).send("Unauthorized!");
  }
  //const { payload } = verified;

  // req["user"] = payload;

  return next();
};

export default isAuth;
