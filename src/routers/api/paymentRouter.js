import express from "express";
import { PaymentController } from "../../app/controllers";
import { validatePaymentOnline } from "../../middleWares/validates/allValidate";

const router = express.Router();

//api/v1/payment

router.post(
  "/create_payment_url",
  validatePaymentOnline,
  PaymentController.createPaymentUrl
);

router.post("/return_url", PaymentController.vnpay_return);

export default router;
