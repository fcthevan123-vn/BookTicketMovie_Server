import express from "express";
import { authorizationAdmin } from "../../middleWares";
import { RoomTypeController } from "../../app/controllers";

const router = express.Router();

// api/v1/roomType
router.post(
  "/create",
  authorizationAdmin,
  RoomTypeController.handleCreateRoomType
);

router.post(
  "/update",
  authorizationAdmin,
  RoomTypeController.handleUpdateRoomType
);

router.get("/get-all", RoomTypeController.handleReadAllRoomType);

router.get("/:id", RoomTypeController.handleReadRoomType);

export default router;
