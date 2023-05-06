"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../auth/middleware"));
const controllers_1 = require("./controllers");
const router = express_1.default.Router();
router.get("", middleware_1.default, controllers_1.getAllUsers);
router.get("/filter", middleware_1.default, controllers_1.filterUsers);
router.get("/:id", middleware_1.default, controllers_1.getUserById);
router.post("", middleware_1.default, controllers_1.createUser);
router.patch("/:id", middleware_1.default, controllers_1.updateUser);
router.delete("/:id", middleware_1.default, controllers_1.deleteUser);
exports.default = router;
//# sourceMappingURL=routes.js.map