import express from "express";
import { authorizationAdmin } from "../../middleWares";
import { DiscountController } from "../../app/controllers";
import { validateDiscount } from "../../middleWares/validates/allValidate";

const router = express.Router();

// api/v1/disount
router.post(
  "/create",
  authorizationAdmin,
  validateDiscount,
  DiscountController.handleCreateDiscount
);

router.get(
  "/get-all-discount",
  authorizationAdmin,
  DiscountController.handleGetAllDiscount
);

router.get(
  "/get-discount/:id",
  authorizationAdmin,
  DiscountController.handleGetDiscountById
);

router.delete(
  "/delete-discount/:id",
  authorizationAdmin,
  DiscountController.handleDeleteDiscount
);

router.post(
  "/update",
  authorizationAdmin,
  validateDiscount,
  DiscountController.handleUpdateDiscount
);

router.get("/validate-discount", DiscountController.handleCheckValidDiscount);

export default router;
