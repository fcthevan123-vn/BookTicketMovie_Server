import express from "express";
import { UserController } from "../../app/controllers";

const router = express.Router();

// [POST] api/v1/user/register
router.post("/register", UserController.handleRegister);

// [GET] api/v1/user/:id/info-user
router.get("/:id/info-user", UserController.handleGetUserById);

export default router;
