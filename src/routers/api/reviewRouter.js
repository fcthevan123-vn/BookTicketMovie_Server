import express from "express";
import { authorizationToken } from "../../middleWares";
import ReviewController from "../../app/controllers/ReviewController";

const router = express.Router();

// api/v1/review
router.post("/create", authorizationToken, ReviewController.handleCreateReview);

router.post("/update", authorizationToken, ReviewController.handleUpdateReview);

router.post(
  "/delete/:id",
  authorizationToken,
  ReviewController.handleDeleteReview
);

router.get("/get-all/:id", ReviewController.handleGetAllReviewOfMovie);

// query movieId, userId
router.post(
  "/get-user-review",
  authorizationToken,
  ReviewController.handleGetReviewOfUserInMovie
);

// query movieId, userId
router.get(
  "/check-user-review",
  // authorizationToken,
  ReviewController.handleCheckReviewOfUser
);

// query movieId
router.get("/calculate-star-rating", ReviewController.handleCalculateStar);

// query userId
router.get("/all-user-review", ReviewController.handleGetAllReviewsOfUser);

export default router;
