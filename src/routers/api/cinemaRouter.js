import express from "express";
import { CinemaController } from "../../app/controllers";
import upload, { authorizationAdmin } from "../../middleWares";

const router = express.Router();

// api/v1/cinema
router.post(
  "/create",
  authorizationAdmin,
  upload.array("image", 1),
  CinemaController.handleCreateCinema
);

router.get("/get-all", CinemaController.handleGetAllCinemas);

router.get("/get-limit", CinemaController.handleGetLimitCinemas);

router.post("/search", CinemaController.hanldeSearchCinema);

router.post("/cinemas-have-shows", CinemaController.handleGetAllCinemasByQuery);

export default router;
