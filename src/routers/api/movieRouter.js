import express from "express";
import { MovieController } from "../../app/controllers";
import upload, { authorizationAdmin } from "../../middleWares";
import {
  validateCreateMovie,
  validateInputMovie,
} from "../../middleWares/validates/movieValidate";

const router = express.Router();

router.get("/get-shows", MovieController.handleGetShowByMovie);

router.post(
  "/create",
  authorizationAdmin,
  // upload.array("images", 6),
  // upload.single("trailerFile"),
  upload.fields([
    {
      name: "images",
      maxCount: 6,
    },
    {
      name: "trailerFile",
      maxCount: 1,
    },
  ]),
  // validateCreateMovie,
  MovieController.handleCreateMovie
);

router.delete(
  "/delete/:id",
  authorizationAdmin,
  MovieController.handleDeleteMovie
);

router.patch(
  "/edit/:id",
  authorizationAdmin,
  upload.fields([
    {
      name: "images",
      maxCount: 6,
    },
    {
      name: "trailerFile",
      maxCount: 1,
    },
  ]),
  validateCreateMovie,
  MovieController.handleEditMovie
);

router.get("/all-movies", MovieController.handleGetAllMovies);

router.get(
  "/all-limit-movies",
  validateInputMovie,
  MovieController.handleGetLimitMovies
);

router.get("/search-movies-by-title", MovieController.handleSearchMovieByTile);

router.get("/trending-movies", MovieController.handleGetTrendingMovie);

router.get("/active-movies", MovieController.handleGetTrendingMovie);

router.get("/next-movies", MovieController.handleGetNextMovies);

router.get("/:id", MovieController.handleGetMovieById);

router.get("/statistic/:id", MovieController.handleGetStatistic);

router.post("/search", MovieController.handleAdvanceSearch);

export default router;
