import { Schema, model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password_hash: string;
  password_salt: string;
  email: string;
  email_confirmed: boolean;
  phone_number: string;
  phone_number_confirmed: boolean;
  access_failed_count: number;
  locked_out: boolean;
  locked_out_end: Date;
  created_date: Date;
  created_by: Types.ObjectId;
  modified_date: Date;
  modified_by: Types.ObjectId;
  is_deleted: boolean;
  deleted_date: Date;
  deleted_by: Types.ObjectId;
}

const userSchema = new Schema<IUser>({
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
const User = model<IUser>("User", userSchema, "user");
export default User;
