import express from "express";
import { FoodController } from "../../app/controllers";
import upload, { authorizationAdmin } from "../../middleWares";

const router = express.Router();

// router.get("/all-food", FoodController.handleGetShowByMovieId);
router.post(
  "/create",
  authorizationAdmin,
  upload.array("images", 1),
  FoodController.handleCreateFood
);

router.post(
  "/update",
  authorizationAdmin,
  upload.array("images", 1),
  FoodController.handleUpdateFood
);

router.get("/all-food", FoodController.handleGetFood);

router.get(
  "/cancel-food",
  authorizationAdmin,
  FoodController.handleChangeStatus
);

export default router;
