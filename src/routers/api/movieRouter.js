import express from "express";
import { MovieController } from "../../app/controllers";
import upload, { authorizationAdmin } from "../../middleWares";

const router = express.Router();

// [POST] api/v1/movie/create
router.post(
  "/create",
  authorizationAdmin,
  upload.array("images", 6),
  MovieController.handleCreateMovie
);

export default router;
