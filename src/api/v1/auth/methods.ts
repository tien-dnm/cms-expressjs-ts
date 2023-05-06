import jwt from "jsonwebtoken";
import moment from "moment";
import crypto from "crypto";
import { IUser } from "../user/model";

export const generateToken = async (payload: unknown) => {
  try {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? "";
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const accessTokenExpired = moment()
      .add(process.env.ACCESS_TOKEN_LIFE, "ms")
      .format("yyyy-MM-DD HH:mm:ss");
    const accessToken = await jwt.sign(
      {
        payload,
      },
      accessTokenSecret,
      {
        algorithm: "HS256",
        expiresIn: accessTokenLife,
      }
    );
    return {
      token: accessToken,
      expirytime: accessTokenExpired,
    };
  } catch (error) {
    console.log(`Error in generating access token:  + ${error}`);
    return null;
  }
};
export const decodeToken = async (token: string) => {
  try {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET ?? "";
    return await jwt.verify(token, accessTokenSecret, {
      ignoreExpiration: true,
    });
  } catch (error) {
    console.log(`Error in decoding access token: ${error}`);
    return null;
  }
};

export const verifyPassword = (user: IUser, password: string) => {
  try {
    const { password_hash, password_salt } = user;
    const checkPassword = crypto
      .createHash("sha256")
      .update(password + password_salt)
      .digest("hex");
    return checkPassword === password_hash;
  } catch (error) {
    console.log(`Error in verifying password: ${error}`);
    return false;
  }
};
