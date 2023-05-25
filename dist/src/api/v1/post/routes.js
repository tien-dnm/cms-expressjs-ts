"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const middleware_1 = __importDefault(require("../auth/middleware"));
const router = express_1.default.Router();
router.get("", controllers_1.getAllPosts);
router.get("/filter", controllers_1.filterPosts);
router.get("/:id", controllers_1.getPostById);
router.post("", controllers_1.createPost);
router.patch("/:id", middleware_1.default, controllers_1.updatePost);
router.delete("/:id", middleware_1.default, controllers_1.deletePost);
exports.default = router;
//# sourceMappingURL=routes.js.map