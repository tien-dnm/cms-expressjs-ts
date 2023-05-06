import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.once("connect", () => {
  console.log(`Redis connected`);
});
redisClient.on("error", () => {
  console.error.bind(console, `Redis connection error: ${process.env.REDIS_URL}`);
  // redisClient.connect();
});
export { redisClient };
