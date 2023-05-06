import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
dotenv.config();

const { connection } = mongoose;

const mongodb = {
  connect: () => {
    const options: ConnectOptions = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    };
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGO_DB_URL || "", options);
  },
};

connection.on("error", () => {
  console.error.bind(console, "MongoDB connection error:");
});
connection.once("open", () => {
  console.log("MongoDB connected");
});

export default mongodb;
