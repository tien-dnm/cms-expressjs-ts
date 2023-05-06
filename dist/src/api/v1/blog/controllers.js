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
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.filterBlogs = exports.getAllBlogs = void 0;
const model_1 = __importDefault(require("./model"));
// ==================================================================
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield model_1.default.find({
            is_deleted: {
                $ne: true,
            },
        });
        res.json(blog);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.getAllBlogs = getAllBlogs;
// ==================================================================
const filterBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const blogs = yield model_1.default.find(actualQuery, "", {
            skip,
            _size,
        });
        res.json(blogs);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.filterBlogs = filterBlogs;
// ==================================================================
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield model_1.default.findById(id, "");
        if (blog) {
            res.json(blog);
        }
        else {
            res.status(400).send("Blog not found");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.getBlogById = getBlogById;
// ==================================================================
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, sub_title, content, author, publish_date } = req.body;
        if (!title || !sub_title || !content) {
            res.status(400).send("Invalid Request");
        }
        const blog = yield model_1.default.create({
            title,
            sub_title,
            content,
            author,
            publish_date,
        });
        const queryBlog = yield model_1.default.findById(
        // eslint-disable-next-line no-underscore-dangle
        blog._id);
        return res.status(201).json(queryBlog);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.createBlog = createBlog;
// ==================================================================
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield model_1.default.findById(id, "");
        if (!blog) {
            res.status(400).send("Blog not found");
        }
        const { content, title, sub_title, author, publish_date } = req.body;
        const updatedBlog = yield model_1.default.findByIdAndUpdate(id, {
            content,
            title,
            sub_title,
            author,
            publish_date,
            modified_date: new Date(),
            modified_by: "",
        }, {
            new: true,
            upsert: false,
        });
        return res.status(200).json(updatedBlog);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send(error.message);
        }
    }
});
exports.updateBlog = updateBlog;
// ==================================================================
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield model_1.default.findById(id, "");
        if (!blog) {
            res.status(400).send("Blog not found");
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
exports.deleteBlog = deleteBlog;
