import express from "express";
import { BookingController } from "../../app/controllers";

const router = express.Router();

// api/v1/booking
router.post("/create", BookingController.handleCreateBooking);

router.get("/by-user/:id", BookingController.handleGetBookingsByUserId);

// router.get("/get-limit", CinemaController.handleGetLimitCinemas);

export default router;
