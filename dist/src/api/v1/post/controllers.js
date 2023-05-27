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
exports.deletePost = exports.updatePost = exports.createPost = exports.getPostById = exports.filterPosts = exports.getAllPosts = exports.filterThenCountPosts = exports.countAllPosts = void 0;
const model_1 = __importDefault(require("./model"));
// ==================================================================
const countAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield model_1.default.find({
            is_deleted: {
                $ne: true,
            },
        }).count();
        res.json({ count });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.countAllPosts = countAllPosts;
const filterThenCountPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const removeItems = ["page", "size", "sort", "search"];
        const { search } = req.query;
        const cloneQuery = Object.assign({}, req.query);
        removeItems.forEach((item) => delete cloneQuery[item]);
        const jsonStringQuery = JSON.stringify(cloneQuery).replace(/\b(eq|ne|gt|gte|lt|lte|regex|search)\b/g, (key) => `$${key}`);
        const actualQuery = JSON.parse(jsonStringQuery);
        if (search) {
            actualQuery["$text"] = {
                "$search": `${search}`,
            };
        }
        const count = yield model_1.default.find(actualQuery, "").count();
        res.json({ count });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.filterThenCountPosts = filterThenCountPosts;
// ==================================================================
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield model_1.default.find({
            is_deleted: {
                $ne: true,
            },
        });
        res.json(post);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.getAllPosts = getAllPosts;
// ==================================================================
const filterPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const removeItems = ["page", "size", "sort", "search"];
        const { page, size, sort, search } = req.query;
        const _size = +(size !== null && size !== void 0 ? size : 0);
        const _page = +(page !== null && page !== void 0 ? page : 0);
        const skip = _size >= 1 ? (_page > 1 ? (_page - 1) * _size : 0) : 0;
        const cloneQuery = Object.assign({}, req.query);
        removeItems.forEach((item) => delete cloneQuery[item]);
        const jsonStringQuery = JSON.stringify(cloneQuery).replace(/\b(eq|ne|gt|gte|lt|lte|regex)\b/g, (key) => `$${key}`);
        const actualQuery = JSON.parse(jsonStringQuery);
        if (search) {
            actualQuery["$text"] = {
                "$search": `${search}`,
            };
        }
        const sortFields = sort ? sort.split(",") : ["publish_date"]; // Default sorting field is 'name'
        const sortOrders = sortFields.map((field) => (field.startsWith("-") ? -1 : 1)); // -1 for descending, 1 for ascending
        const sortKeys = sortFields.map((field) => field.replace(/^-/, "")); // Remove '-' sign if present
        // Build the sorting object
        const sortObj = {};
        sortKeys.forEach((key, index) => {
            sortObj[key] = sortOrders[index];
        });
        const posts = yield model_1.default.find(actualQuery, "", {
            skip,
            limit: _size,
            sort: sortObj,
        });
        res.json(posts);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.status(400).send(error.message);
        }
    }
});
exports.filterPosts = filterPosts;
// ==================================================================
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield model_1.default.findById(id, "");
        if (post) {
            res.json(post);
        }
        else {
            res.status(400).send("Post not found");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.getPostById = getPostById;
// ==================================================================
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, sub_title, content, author, publish_date, thumbnail_link, slug } = req.body;
        if (!title || !sub_title || !content) {
            res.status(400).send("Invalid Request");
        }
        const post = yield model_1.default.create({
            title,
            sub_title,
            content,
            author,
            publish_date,
            thumbnail_link,
            slug,
        });
        const queryPost = yield model_1.default.findById(
        // eslint-disable-next-line no-underscore-dangle
        post._id);
        return res.status(201).json(queryPost);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.createPost = createPost;
// ==================================================================
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield model_1.default.findById(id);
        if (!post) {
            res.status(400).send("Post not found");
        }
        const { content, title, sub_title, author, publish_date, slug, thumbnail_link } = req.body;
        const updatedPost = yield model_1.default.findByIdAndUpdate(id, {
            content,
            title,
            sub_title,
            author,
            publish_date,
            modified_date: new Date(),
            // modified_by: "",
            slug,
            thumbnail_link,
        }, {
            new: true,
            upsert: false,
        });
        return res.status(200).json(updatedPost);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.updatePost = updatePost;
// ==================================================================
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield model_1.default.findById(id, "");
        if (!post) {
            res.status(400).send("Post not found");
        }
        yield model_1.default.findByIdAndUpdate(id, {
            is_deleted: true,
            deleted_date: new Date(),
            deleted_by: "",
        }, {
            new: true,
            upsert: false,
            select: "",
        });
        return res.status(204).json("Deleted");
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.deletePost = deletePost;
//# sourceMappingURL=controllers.js.map