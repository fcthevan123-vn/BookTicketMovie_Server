import { createError } from "http-errors";
import router from "./routers";
import express from "express";
import path from "path";
import logger from "morgan";
import * as dotenv from "dotenv";
import connectDb from "./config/db";
import { handleError } from "./middleWares";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Logger browser
app.use(logger("dev"));

// Parse body object from request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"], // chỉ cho phép truy cập từ domain này []
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // chỉ cho phép sử dụng các phương thức này
  })
);

app.use(cookieParser());

// Connect to database
connectDb();

// Use Middaleware
app.use(handleError);

// Static files
app.use(express.static(path.join(__dirname, "public")));

router(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
