import express from "express";
import path from "path";
import logger from "morgan";
import * as dotenv from "dotenv";
import { createError } from "http-errors";
import route from "./routers";
import connectDb from "./config/db";
import { handleError } from "./middleWares";
import cors from "cors";
dotenv.config();

const app = express();

// Logger browser
app.use(logger("dev"));

// app.get("/", (req, res) => {
//   return res.json("Test");
// });

// Parse body object from request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use cookie
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: [
//       "http://127.0.0.1:1805",
//       "http://localhost:1805",
//       "http://192.168.0.115:1805",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   })
// );

// Connect to database
connectDb();

route(app);

// Use Middaleware
app.use(handleError);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

module.exports = app;
