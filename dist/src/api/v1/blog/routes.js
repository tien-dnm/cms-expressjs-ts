"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const middleware_1 = __importDefault(require("../auth/middleware"));
const router = express_1.default.Router();
router.get("", controllers_1.getAllBlogs);
router.get("/filter", controllers_1.filterBlogs);
router.get("/:id", controllers_1.getBlogById);
router.post("", middleware_1.default, controllers_1.createBlog);
router.patch("/:id", middleware_1.default, controllers_1.updateBlog);
router.delete("/:id", middleware_1.default, controllers_1.deleteBlog);
exports.default = router;
