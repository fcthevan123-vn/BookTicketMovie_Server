import express from "express";
import { MovieController } from "../../app/controllers";
import upload, { authorizationAdmin } from "../../middleWares";
import {
  validateCreateMovie,
  validateInputMovie,
} from "../../middleWares/validates/movieValidate";

const router = express.Router();

// [POST] api/v1/movie/create
router.post(
  "/create",
  authorizationAdmin,
  upload.array("images", 6),
  validateCreateMovie,
  MovieController.handleCreateMovie
);

// [POST] api/v1/movie/delete/:id
router.delete(
  "/delete/:id",
  authorizationAdmin,
  MovieController.handleDeleteMovie
);

// [PATCH] api/v1/movie/edit/:id
router.patch(
  "/edit/:id",
  authorizationAdmin,
  upload.array("images", 6),
  validateCreateMovie,
  MovieController.handleEditMovie
);

// [GET] api/v1/movie/all-movies?isCount=
router.get(
  "/all-movies",
  authorizationAdmin,
  MovieController.handleGetAllMovies
);

// [GET] api/v1/movie/all-limit-movies?page=&?limit=
router.get(
  "/all-limit-movies",
  authorizationAdmin,
  validateInputMovie,
  MovieController.handleGetLimitMovies
);

// [GET] api/v1/movie/search-movies-by-title?title=
router.get("/search-movies-by-title", MovieController.handleSearchMovieByTile);

export default router;
