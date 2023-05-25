import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  username: {
    type: String,
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  password_salt: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  email_confirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  phone_number: {
    type: String,
    required: false,
  },
  phone_number_confirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  access_failed_count: {
    type: Number,
    required: false,
  },
  locked_out: {
    type: Boolean,
    required: false,
    default: false,
  },
  locked_out_end: {
    type: Date,
    required: false,
  },
  created_date: {
    type: Date,
    required: false,
    default: new Date(),
  },
  created_by: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
  modified_date: {
    type: Date,
    required: false,
  },
  modified_by: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
  is_deleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  deleted_date: {
    type: Date,
    required: false,
    default: null,
  },
  deleted_by: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "User",
    default: null,
  },
});

export type User = InferSchemaType<typeof userSchema>;

const User = model<User>("User", userSchema, "user");

export default User;
