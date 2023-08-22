import { createError } from "http-errors";
import router from "./routers";
import express from "express";
import path from "path";
import logger from "morgan";
import * as dotenv from "dotenv";
import connectDb from "./config/db";
import { handleError } from "./middleWares";

dotenv.config();

const app = express();

// Logger browser
app.use(logger("dev"));

// Parse body object from request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
