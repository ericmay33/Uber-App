import express, { Request, Response } from "express";
import { createPayment } from "../controllers/stripeController";

const router = express.Router();

router.post('/create-payment-intent', createPayment);

export default router;
