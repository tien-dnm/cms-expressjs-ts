"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    modified_date: {
        type: Date,
        required: false,
    },
    modified_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
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
        required: true,
        ref: "User",
        default: null,
    },
});
const User = (0, mongoose_1.model)("User", userSchema, "user");
exports.default = User;
//# sourceMappingURL=model.js.map