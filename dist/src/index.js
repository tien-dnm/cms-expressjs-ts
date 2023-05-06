"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const redis_1 = require("./config/redis");
const routes_1 = __importDefault(require("./api/v1/routes"));
dotenv_1.default.config();
mongodb_1.default.connect();
redis_1.redisClient.connect();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.use("/v1", routes_1.default);
app.use((req, res) => {
    res.status(404).send("Not Found");
});
app.use((err, req, res) => {
    console.log(err.stack);
    res.status(err.httpCode || 500).send(err.message);
});
const server = app.listen(process.env.PORT, () => {
    const addressInfo = server.address();
    console.log(`Express running → PORT ${addressInfo === null || addressInfo === void 0 ? void 0 : addressInfo.port}`);
});
//# sourceMappingURL=index.js.map