import express from "express";
import { UserController } from "../../app/controllers";
import { authorizationToken } from "../../middleWares";

const router = express.Router();

// [POST] api/v1/user/register
router.post("/register", UserController.handleRegister);

// [GET] api/v1/user/:id/info-user
router.get("/:id/info-user", UserController.handleGetUserById);

// [PATCH] api/v1/user/:id/update
router.patch(
  "/:id/update",
  authorizationToken,
  UserController.handleUpdateInfor
);

// [PATCH] api/v1/user/:id/update-password
router.patch(
  "/:id/update-password",
  authorizationToken,
  UserController.handleChangePassword
);

export default router;
