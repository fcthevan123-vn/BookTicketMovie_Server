import express from "express";
import { UsersController } from "../app/controllers";

const router = express.Router();

router.get("/all-users", UsersController.testUsers);
router.get("/", UsersController.index);

export default router;
