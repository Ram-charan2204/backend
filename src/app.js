import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({ path: "./.env" });
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
