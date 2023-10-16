import userRouter from "./userRouter";
import authenticateRouter from "./authenticateRouter";
import movieRouter from "./movieRouter";
import cinemaRouter from "./cinemaRouter";
import movieHallRouter from "./movieHallRouter";

import express from "express";
const router = express.Router();

router.use("/authenticate", authenticateRouter);
router.use("/user", userRouter);
router.use("/movie", movieRouter);
router.use("/cinema", cinemaRouter);
router.use("/movie-hall", movieHallRouter);

export default router;
