import { Schema, model, InferSchemaType } from "mongoose";

const refreshTokenSchema = new Schema({
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

export type RefreshToken = InferSchemaType<typeof refreshTokenSchema>;

const RefreshToken = model<RefreshToken>(
  "RefreshToken",
  refreshTokenSchema,
  "refresh_token"
);
export default RefreshToken;
