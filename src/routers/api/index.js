import userRouter from "./userRouter";
import authenticateRouter from "./authenticateRouter";
import movieRouter from "./movieRouter";
import cinemaRouter from "./cinemaRouter";
import movieHallRouter from "./movieHallRouter";
import roomTypeRouter from "./roomTypeRouter";
import layoutRouter from "./layoutRouter";
import showRouter from "./showRouter";
import seatRouter from "./seatRouter";

import express from "express";
const router = express.Router();

router.use("/authenticate", authenticateRouter);
router.use("/user", userRouter);
router.use("/movie", movieRouter);
router.use("/cinema", cinemaRouter);
router.use("/movie-hall", movieHallRouter);
router.use("/roomType", roomTypeRouter);
router.use("/layout", layoutRouter);
router.use("/show", showRouter);
router.use("/seat", seatRouter);

export default router;
