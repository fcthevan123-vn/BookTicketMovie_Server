import express from "express";
import { UserController } from "../../app/controllers";

const router = express.Router();

// [POST] api/v1/user/register
router.post("/register", UserController.handleRegister);

export default router;
