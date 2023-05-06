import { Types, Schema, model } from "mongoose";

export interface IBlog {
  _id: Types.ObjectId;
  title: string;
  sub_title: string;
  content: string;
  author: string;
  publish_date: Date;
  created_date: Date;
  created_by: Types.ObjectId;
  modified_date: Date;
  modified_by: Types.ObjectId;
  is_deleted: boolean;
  deleted_date: Date;
  deleted_by: Types.ObjectId;
}

const blogSchema = new Schema<IBlog>({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  title: {
    type: String,
    required: true,
  },
  sub_title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
  publish_date: {
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

export default model<IBlog>("Blog", blogSchema, "blog");
