import express from "express";
import { AuthenticateController } from "../../app/controllers";
import { authorizationToken } from "../../middleWares";

const router = express.Router();

// [POST] api/v1/authenticate/login
router.post("/login", AuthenticateController.handleLogin);
router.post(
  "/get-profile",
  authorizationToken,
  AuthenticateController.handleGetProfile
);

export default router;
