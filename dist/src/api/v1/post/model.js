"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "User",
    },
    modified_date: {
        type: Date,
        required: false,
    },
    modified_by: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "User",
        default: null,
    },
});
postSchema.index({
    "title": "text",
    "sub_title": "text",
    "content": "text",
    "author": "text",
    "slug": "text",
});
exports.default = (0, mongoose_1.model)("Post", postSchema, "post");
//# sourceMappingURL=model.js.map