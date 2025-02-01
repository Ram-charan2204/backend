import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
dotenv.config({ path: "./.env" });
console.log(process.env.MongodbUrl + DB_NAME);
const ConnectDb = async () => {
  try {
    const mong = await mongoose.connect(process.env.MongodbUrl + DB_NAME);
    console.log("connected to the database", mong.connection.host);
  } catch (err) {
    console.log("Error connecting to the database", err);
  }
};
ConnectDb();
