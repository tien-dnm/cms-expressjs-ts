"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const { connection } = mongoose_1.default;
const mongodb = {
    connect: () => {
        const options = {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        };
        mongoose_1.default.set("strictQuery", true);
        mongoose_1.default.connect(process.env.MONGO_DB_URL || "", options);
    },
};
connection.on("error", () => {
    console.error.bind(console, "MongoDB connection error:");
});
connection.once("open", () => {
    console.log("MongoDB connected");
});
exports.default = mongodb;
