import express from "express";
import { getDirections } from "../controllers/directionsController";

const router = express.Router();

router.get('/', getDirections);

export default router;
