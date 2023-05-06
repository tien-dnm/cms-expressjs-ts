"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const refreshTokenSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const RefreshToken = (0, mongoose_1.model)("RefreshToken", refreshTokenSchema, "refresh_token");
exports.default = RefreshToken;
//# sourceMappingURL=model.js.map