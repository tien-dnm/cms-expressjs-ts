import { Types, Schema, model } from "mongoose";

export interface IRefreshToken {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  token: string;
  is_revoked: boolean;
  expires: Date;
  is_used: boolean;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  is_revoked: {
    type: Boolean,
    required: false,
  },
  expires: {
    type: Date,
    required: false,
  },
  is_used: {
    type: Boolean,
    required: false,
  },
});
const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
  "refresh_token"
);
export default RefreshToken;
