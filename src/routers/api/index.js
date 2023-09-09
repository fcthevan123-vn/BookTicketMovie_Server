import userRouter from "./userRouter";
import authenticateRouter from "./authenticateRouter";
import movieRouter from "./movieRouter";

import express from "express";
const router = express.Router();

router.use("/authenticate", authenticateRouter);
router.use("/user", userRouter);
router.use("/movie", movieRouter);

export default router;
