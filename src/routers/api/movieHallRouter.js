import express from "express";
import { MovieHallController } from "../../app/controllers";

const router = express.Router();

// api/v1/cinema
router.get("/get-all", MovieHallController.handleGetAllMovieHall);

export default router;
