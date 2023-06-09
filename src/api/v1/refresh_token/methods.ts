import randToken from "rand-token";
import moment from "moment";
import RefreshToken from "./model";
import { ObjectId } from "mongoose";

export const generateRefreshToken = () => {
  const newRefreshToken = randToken.generate(100);
  const refreshTokenExpired = moment()
    .add(process.env.REFRESH_TOKEN_LIFE, "ms")
    .format("yyyy-MM-DD HH:mm:ss");
  return {
    newRefreshToken,
    refreshTokenExpired,
  };
};
export const saveRefreshToken = async (
  user_id: ObjectId,
  refreshToken: string,
  refreshTokenExpired: string
) => {
  try {
    await RefreshToken.create({
      user_id,
      token: refreshToken,
      expires: refreshTokenExpired,
      is_revoked: false,
      is_used: false,
    });
  } catch (error) {
    throw new Error("Cannot generate new refresh token!");
  }
};
export const useRefreshToken = async (user_id: ObjectId, refreshToken: string) => {
  try {
    await RefreshToken.findOneAndUpdate(
      { user_id, token: refreshToken },
      { is_used: true },
      { new: true, upsert: false }
    );
  } catch (error) {
    throw new Error("Cannot use refresh token!");
  }
};
export const IsValidRefreshToken = async (user_id: ObjectId, refreshToken: string) => {
  const currentDate = new Date();
  const checkRefreshToken = await RefreshToken.findOne({
    user_id,
    token: refreshToken,
    expires: { $gte: currentDate },
    is_used: { $ne: true },
    is_revoked: { $ne: true },
  });
  return checkRefreshToken !== null;
};
