import express from "express";
import { NotificationController } from "../../app/controllers";

const router = express.Router();

router.post("/create", NotificationController.hanldeCreateNotification);
router.get("/all-noti", NotificationController.handleGetAllNoti);

export default router;
