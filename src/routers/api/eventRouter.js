import express from "express";
import { EventController } from "../../app/controllers";
import upload, { authorizationAdmin } from "../../middleWares";
import { validateEventInput } from "../../middleWares/validates/eventValidate";

const router = express.Router();

// api/v1/event
router.post(
  "/create",
  authorizationAdmin,
  upload.array("images", 1),
  validateEventInput,
  EventController.handleCreateEvent
);

router.post(
  "/update/:id",
  authorizationAdmin,
  upload.array("images", 1),
  validateEventInput,
  EventController.handleUpdateEvent
);

router.get("/get-all-events", EventController.handleGetAllEvent);

router.get("/get-event/:id", EventController.handleGetOneEvent);

router.delete("/delete-event/:id", EventController.handleDeleteEvent);

export default router;
