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
Object.defineProperty(exports, "__esModule", { value: true });
// import User from "../user/model";
const methods_1 = require("./methods");
// const User = require("../user/model");
// const { decodeToken } = require("./methods");
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header("authorization") || "";
    const accessTokenFromHeader = authHeader.replace("Bearer ", "");
    if (!accessTokenFromHeader) {
        return res.status(401).send("Invalid access token.");
    }
    const verified = (yield (0, methods_1.decodeToken)(accessTokenFromHeader));
    if (!verified) {
        return res.status(401).send("Unauthorized!");
    }
    //const { payload } = verified;
    // req["user"] = payload;
    return next();
});
exports.default = isAuth;
//# sourceMappingURL=middleware.js.map