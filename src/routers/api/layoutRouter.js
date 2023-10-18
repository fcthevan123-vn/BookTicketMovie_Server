import express from "express";
import { authorizationAdmin } from "../../middleWares";
import { LayoutController } from "../../app/controllers";

const router = express.Router();

// api/v1/layout
router.post("/create", authorizationAdmin, LayoutController.handleCreateLayout);

router.get("/get-all", LayoutController.handleReadAllLayout);

router.get("/:id", LayoutController.handleReadLayout);

export default router;
