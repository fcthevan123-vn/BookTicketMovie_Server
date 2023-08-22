import userRouter from "./userRouter";
import authenticateRouter from "./authenticateRouter";

import express from "express";
const router = express.Router();

router.use("/authenticate", authenticateRouter);
router.use("/user", userRouter);

export default router;
