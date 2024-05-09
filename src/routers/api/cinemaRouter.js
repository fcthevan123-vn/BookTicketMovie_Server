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

router.post(
  "/update",
  authorizationAdmin,
  upload.array("image", 1),
  CinemaController.handleUpdateCinema
);

router.get("/get-limit", CinemaController.handleGetLimitCinemas);

router.get("/get-all", CinemaController.handleGetAllCinemas);

router.post("/search", CinemaController.hanldeSearchCinema);

router.post("/cinemas-have-shows", CinemaController.handleGetAllCinemasByQuery);

router.get("/by-staff", CinemaController.handleGetCinemaByStaff);
router.post("/filter-cinema", CinemaController.handleFilterCinema);

export default router;
