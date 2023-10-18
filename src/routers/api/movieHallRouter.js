import express from "express";
import { MovieHallController } from "../../app/controllers";

const router = express.Router();

// api/v1/movie-hall
router.get("/get-all", MovieHallController.handleGetAllMovieHall);
router.post("/create", MovieHallController.handleCreateMovieHall);

export default router;
