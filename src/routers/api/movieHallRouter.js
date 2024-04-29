import express from "express";
import { MovieHallController } from "../../app/controllers";
import { authorizationAdmin } from "../../middleWares";

const router = express.Router();

// api/v1/movie-hall
router.get("/get-all", MovieHallController.handleGetAllMovieHall);
router.post(
  "/create",
  authorizationAdmin,
  MovieHallController.handleCreateMovieHall
);

router.post(
  "/update",
  authorizationAdmin,
  MovieHallController.handleUpdateMovieHall
);

router.get("/get-one", MovieHallController.handleGetAllMovieHallByStaff);

export default router;
