import express from "express";
import { AuthenticateController } from "../../app/controllers";
import { authorizationToken } from "../../middleWares";

const router = express.Router();

// [POST] api/v1/authenticate/login
router.post("/login", AuthenticateController.handleLogin);
router.get(
  "/get-profile",
  authorizationToken,
  AuthenticateController.handleGetProfile
);

router.post("/logout", authorizationToken, AuthenticateController.handleLogout);

router.post("/verify-email/:id", AuthenticateController.handleVerifyEmail);

router.post("/confirm-email/:id", AuthenticateController.handleConfirmEmail);

export default router;
