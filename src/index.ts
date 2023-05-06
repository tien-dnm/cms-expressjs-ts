import dotenv from "dotenv";
import express, { Request, Response } from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import { AddressInfo } from "net";
import { AppError } from "../exceptions/AppError";
import mongodb from "./config/mongodb";
import { redisClient } from "./config/redis";
import v1Router from "./api/v1/routes";

dotenv.config();

mongodb.connect();

redisClient.connect();

const app = express();

app.use("/favicon.ico", express.static("src/images/favicon.ico"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev"));

app.use(cors());

app.get("/", (req, res) => {
  res.json(["HELLO WORLD"]);
});

app.use("/v1", v1Router);

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.use((err: AppError, req: Request, res: Response) => {
  console.log(err.stack);
  res.status(err.httpCode || 500).send(err.message);
});

const server = app.listen(process.env.PORT, () => {
  const addressInfo = server.address() as AddressInfo | null;
  console.log(`Express running → PORT ${addressInfo?.port}`);
});
