import { Schema, model, InferSchemaType } from "mongoose";

const postSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  thumbnail_link: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
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
  slug: {
    type: String,
    required: true,
    unique: true,
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

postSchema.index({
  "title": "text",
  "description": "text",
  "content": "text",
  "author": "text",
  "slug": "text",
});

export type Post = InferSchemaType<typeof postSchema>;

export default model<Post>("Post", postSchema, "post");
