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
  MovieController.handleGetLimitMovies
);

// [GET] api/v1/movie/search-movies-by-title?title=
router.get("/search-movies-by-title", MovieController.handleSearchMovieByTile);

export default router;
