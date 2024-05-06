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
import sendVerificationEmail from "./middleWares/nodeMailer";
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Logger browser
app.use(logger("dev"));

// Parse body object from request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // chỉ cho phép sử dụng các phương thức này
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

// Socket.io
io.on("connection", (socket) => {
  socket.on("newNotification", async () => {
    console.log("New notification");
    io.emit("fetchNotification");
  });
  socket.on("after_read_message", async () => {
    io.emit("fetchNotificationAfterRead");
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
