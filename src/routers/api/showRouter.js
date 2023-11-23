import express from "express";
import { ShowController } from "../../app/controllers";

const router = express.Router();

// api/v1/show
// router.post(
//   "/create",
//   RoomTypeController.handleCreateRoomType
// );

// router.get("/get-all", RoomTypeController.handleReadAllRoomType);

router.get("/before-pick-seat", ShowController.handleGetShowByMovieId);

router.post("/create", ShowController.handleCreateShow);
router.delete("/:id", ShowController.handleDeleteShow);

export default router;
