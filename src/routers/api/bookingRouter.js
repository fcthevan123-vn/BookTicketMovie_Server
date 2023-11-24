import express from "express";
import { BookingController } from "../../app/controllers";
import { authorizationAdmin } from "../../middleWares";

const router = express.Router();

// api/v1/booking
router.post("/create", BookingController.handleCreateBooking);
router.get("/statistic", BookingController.handleGetStatistic);

router.get("/by-user/:id", BookingController.handleGetBookingsByUserId);

router.delete("/:id", BookingController.handleDeleteBooking);

router.post(
  "/update",
  authorizationAdmin,
  BookingController.handleUpdateBooking
);

router.post("/by-status", BookingController.handleGetBookingByStatus);

export default router;
