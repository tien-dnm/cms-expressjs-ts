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
exports.verifyPassword = exports.decodeToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const crypto_1 = __importDefault(require("crypto"));
const generateToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accessTokenSecret = (_a = process.env.ACCESS_TOKEN_SECRET) !== null && _a !== void 0 ? _a : "";
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenExpired = (0, moment_1.default)()
            .add(process.env.ACCESS_TOKEN_LIFE, "ms")
            .format("yyyy-MM-DD HH:mm:ss");
        const accessToken = yield jsonwebtoken_1.default.sign({
            payload,
        }, accessTokenSecret, {
            algorithm: "HS256",
            expiresIn: accessTokenLife,
        });
        return {
            token: accessToken,
            expirytime: accessTokenExpired,
        };
    }
    catch (error) {
        console.log(`Error in generating access token:  + ${error}`);
        return null;
    }
});
exports.generateToken = generateToken;
const decodeToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const accessTokenSecret = (_b = process.env.ACCESS_TOKEN_SECRET) !== null && _b !== void 0 ? _b : "";
        return yield jsonwebtoken_1.default.verify(token, accessTokenSecret, {
            ignoreExpiration: true,
        });
    }
    catch (error) {
        console.log(`Error in decoding access token: ${error}`);
        return null;
    }
});
exports.decodeToken = decodeToken;
const verifyPassword = (user, password) => {
    try {
        const { password_hash, password_salt } = user;
        const checkPassword = crypto_1.default
            .createHash("sha256")
            .update(password + password_salt)
            .digest("hex");
        return checkPassword === password_hash;
    }
    catch (error) {
        console.log(`Error in verifying password: ${error}`);
        return false;
    }
};
exports.verifyPassword = verifyPassword;
