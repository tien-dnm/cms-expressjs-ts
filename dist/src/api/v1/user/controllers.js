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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.filterUsers = exports.getAllUsers = void 0;
const rand_token_1 = __importDefault(require("rand-token"));
const crypto_1 = __importDefault(require("crypto"));
const model_1 = __importDefault(require("./model"));
// ==================================================================
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.find({
            is_deleted: {
                $ne: true,
            },
        }, "-password_hash -password_salt");
        res.json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.getAllUsers = getAllUsers;
// ==================================================================
const filterUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const removeItems = ["page", "size"];
        const { page, size } = req.query;
        const _size = +(size !== null && size !== void 0 ? size : 0);
        const _page = +(page !== null && page !== void 0 ? page : 0);
        const skip = _size >= 1 ? (_page > 1 ? _page - 1 : 0 * _size) : 0;
        const cloneQuery = Object.assign({}, req.query);
        removeItems.forEach((item) => delete cloneQuery[item]);
        const jsonStringQuery = JSON.stringify(cloneQuery).replace(/\b(eq|ne|gt|gte|lt|lte|regex)\b/g, (key) => `$${key}`);
        const actualQuery = JSON.parse(jsonStringQuery);
        const users = yield model_1.default.find(actualQuery, "-password_hash -password_salt", {
            skip,
            _size,
        });
        res.json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.filterUsers = filterUsers;
// ==================================================================
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield model_1.default.findById(id, "-password_hash -password_salt");
        if (user) {
            res.json(user);
        }
        else {
            res.status(400).send("User not found");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, confirm_password, email, phone_number } = req.body;
        if (!username || !password || !confirm_password) {
            res.status(400).send("Invalid Request");
        }
        if (password !== confirm_password) {
            res.status(400).send("Password does not match");
        }
        const password_salt = rand_token_1.default.generate(69);
        const password_hash = crypto_1.default
            .createHash("sha256")
            .update(password + password_salt)
            .digest("hex");
        const user = yield model_1.default.create({
            username,
            password_hash,
            password_salt,
            email,
            phone_number,
        });
        const queryUser = yield model_1.default.findById(
        // eslint-disable-next-line no-underscore-dangle
        user._id, "-password_hash -password_salt");
        return res.status(201).json(queryUser);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield model_1.default.findById(id, "-password_hash -password_salt");
        if (!user) {
            res.status(400).send("User not found");
        }
        const { email, phone_number } = req.body;
        const updatedUser = yield model_1.default.findByIdAndUpdate(id, {
            email,
            phone_number,
            modified_date: new Date(),
            modified_by: "",
        }, {
            new: true,
            upsert: false,
            select: "-password_hash -password_salt",
        });
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield model_1.default.findById(id, "-password_hash -password_salt");
        if (!user) {
            res.status(400).send("User not found");
        }
        yield model_1.default.findByIdAndUpdate(id, {
            is_deleted: true,
            deleted_date: new Date(),
            deleted_by: "",
        }, {
            new: true,
            upsert: false,
            select: "-password_hash -password_salt",
        });
        return res.status(204).json("Deleted");
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.deleteUser = deleteUser;
