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
import http from "http";
import socketIo from "socket.io";
import { notificationServices } from "./services";
// const http = require("http");
// const socketIo = require("socket.io");

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

// const port = process.env.PORT;

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Socket.io
io.on("connection", (socket) => {
  console.log("socket.id", socket.id);
  socket.on("newNotification", async () => {
    io.emit("fetchNotification");
  });
  socket.on("read_notification", async (unreadNoti) => {
    await notificationServices.readNotification(unreadNoti);
    io.emit("fetchNotification");
  });
});

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

server.listen(3001, () => {
  console.log("Dang chay tai cong 3001");
});

module.exports = app;
