import express from "express";
import { SeatController } from "../../app/controllers";

const router = express.Router();

// api/v1/show
// router.post(
//   "/create",
//   RoomTypeController.handleCreateRoomType
// );

// router.get("/get-all", RoomTypeController.handleReadAllRoomType);

router.get("/all-seats-by-show/:id", SeatController.handleGetAllSeatByShowId);

router.get("/all-seatTypes", SeatController.handleGetAllSeatType);

router.post("/create-seatType", SeatController.handleCreateSeatType);

router.post("/update-seatType", SeatController.handleUpdateSeatType);

export default router;
