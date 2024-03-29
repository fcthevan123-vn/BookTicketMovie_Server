import express from "express";
import { PaymentController } from "../../app/controllers";

const router = express.Router();

router.post("/create_payment_url", PaymentController.createPaymentUrl);

export default router;
