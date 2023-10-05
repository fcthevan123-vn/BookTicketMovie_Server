import express from "express";
import { UserController } from "../../app/controllers";
import { authorizationAdmin, authorizationToken } from "../../middleWares";

const router = express.Router();

// [POST] api/v1/user/register-by-admin?isAdmin
router.post(
  "/register-by-admin",
  authorizationAdmin,
  UserController.handleRegister
);

// [DELETE] api/v1/user/delete/:id
router.delete(
  "/delete/:id",
  authorizationAdmin,
  UserController.handleDeleteUser
);

// [POST] api/v1/user/register
router.post("/register", UserController.handleRegister);

// [GET] api/v1/user/:id/info-user
router.get("/:id/info-user", UserController.handleGetUserById);

// [GET] api/v1/user/all-user?page=&?limit=
router.get(
  "/all-user",
  authorizationToken,
  authorizationAdmin,
  UserController.handleGetAllUserByAdmin
);

// [PATCH] api/v1/user/:id/update
router.patch(
  "/:id/update",
  authorizationToken,
  UserController.handleUpdateInfor
);

// [PATCH] api/v1/user/:id/update?isAdmin=true
router.patch(
  "/:id/update",
  authorizationToken,
  authorizationAdmin,
  UserController.handleUpdateInfor
);

// [PATCH] api/v1/user/:id/update-password
router.patch(
  "/:id/update-password",
  authorizationToken,
  UserController.handleChangePassword
);

// [GET] api/v1/user/search-by-admin?name=&page=&limit=
router.get(
  "/search-by-admin",
  authorizationToken,
  authorizationAdmin,
  UserController.handleSearchUser
);

export default router;
