"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.accessToken = void 0;
const methods_1 = require("../refresh_token/methods");
const model_1 = __importDefault(require("../user/model"));
const methods_2 = require("./methods");
const accessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield model_1.default.findOne({
            username,
            is_deleted: { $ne: true },
        });
        if (!user) {
            return res.status(404).send("User not found!");
        }
        const { id, email, phone_number, locked_out } = user;
        if (locked_out) {
            return res.status(401).send("User account has been locked out");
        }
        const isPasswordValid = (0, methods_2.verifyPassword)(user, password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid username or password");
        }
        const payload = {
            id,
            username,
            email,
            phone_number,
        };
        const access_token = yield (0, methods_2.generateToken)(payload);
        if (!access_token) {
            return res.status(401).send("Login failed");
        }
        const { newRefreshToken, refreshTokenExpired } = (0, methods_1.generateRefreshToken)();
        yield (0, methods_1.saveRefreshToken)(id, newRefreshToken, refreshTokenExpired);
        return res.json({
            access_token: access_token.token,
            expires_time: access_token.expirytime,
            refresh_token: newRefreshToken,
            user: payload,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.accessToken = accessToken;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("authorization") || "";
        const accessTokenFromHeader = authHeader.replace("Bearer ", "");
        if (!accessTokenFromHeader) {
            throw new Error("Invalid access token.");
        }
        const { refresh_token } = req.body;
        if (!refresh_token) {
            throw new Error("Invalid refresh token.");
        }
        const decoded = (yield (0, methods_2.decodeToken)(accessTokenFromHeader));
        if (!decoded) {
            throw new Error("Invalid access token.");
        }
        const { id } = decoded.payload;
        const user = yield model_1.default.findById(id);
        if (!user) {
            throw new Error("User not found!");
        }
        const { username, email, phone_number, locked_out } = user;
        if (locked_out) {
            return res.status(401).send("User account has been locked out");
        }
        const payload = {
            id,
            username,
            email,
            phone_number,
        };
        const isValidRefreshToken = yield (0, methods_1.IsValidRefreshToken)(id, refresh_token);
        if (!isValidRefreshToken) {
            throw new Error("Cannot generate new refresh token");
        }
        const access_token = yield (0, methods_2.generateToken)(payload);
        if (!access_token) {
            throw new Error("Failed to generate new access token");
        }
        yield (0, methods_1.useRefreshToken)(id, refresh_token);
        const { newRefreshToken, refreshTokenExpired } = (0, methods_1.generateRefreshToken)();
        yield (0, methods_1.saveRefreshToken)(id, newRefreshToken, refreshTokenExpired);
        return res.json({
            access_token: access_token.token,
            expires_time: access_token.expirytime,
            refresh_token: newRefreshToken,
            user: payload,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.refreshToken = refreshToken;
//# sourceMappingURL=controllers.js.map