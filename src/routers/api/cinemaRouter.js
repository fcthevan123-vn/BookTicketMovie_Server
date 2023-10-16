import express from "express";
import { CinemaController } from "../../app/controllers";
import { authorizationAdmin } from "../../middleWares";

const router = express.Router();

// api/v1/cinema
router.post("/create", authorizationAdmin, CinemaController.handleCreateCinema);

router.get("/get-all", CinemaController.handleGetAllCinemas);

export default router;
