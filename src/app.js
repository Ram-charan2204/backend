import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config({ path: "./.env" });
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";

app.post("/", (req, res) => {
  res.send("Hello world");
});

app.use("/users", userRouter);

export default app;
