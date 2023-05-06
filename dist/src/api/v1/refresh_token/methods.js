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
exports.IsValidRefreshToken = exports.useRefreshToken = exports.saveRefreshToken = exports.generateRefreshToken = void 0;
const rand_token_1 = __importDefault(require("rand-token"));
const moment_1 = __importDefault(require("moment"));
const model_1 = __importDefault(require("./model"));
const generateRefreshToken = () => {
    const newRefreshToken = rand_token_1.default.generate(100);
    const refreshTokenExpired = (0, moment_1.default)()
        .add(process.env.REFRESH_TOKEN_LIFE, "ms")
        .format("yyyy-MM-DD HH:mm:ss");
    return {
        newRefreshToken,
        refreshTokenExpired,
    };
};
exports.generateRefreshToken = generateRefreshToken;
const saveRefreshToken = (user_id, refreshToken, refreshTokenExpired) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.default.create({
            user_id,
            token: refreshToken,
            expires: refreshTokenExpired,
            is_revoked: false,
            is_used: false,
        });
    }
    catch (error) {
        throw new Error("Cannot generate new refresh token!");
    }
});
exports.saveRefreshToken = saveRefreshToken;
const useRefreshToken = (user_id, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_1.default.findOneAndUpdate({ user_id, token: refreshToken }, { is_used: true }, { new: true, upsert: false });
    }
    catch (error) {
        throw new Error("Cannot use refresh token!");
    }
});
exports.useRefreshToken = useRefreshToken;
const IsValidRefreshToken = (user_id, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const checkRefreshToken = yield model_1.default.findOne({
        user_id,
        token: refreshToken,
        expires: { $gte: currentDate },
        is_used: { $ne: true },
        is_revoked: { $ne: true },
    });
    return checkRefreshToken !== null;
});
exports.IsValidRefreshToken = IsValidRefreshToken;
