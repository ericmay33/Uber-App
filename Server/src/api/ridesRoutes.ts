import express, { Request, Response } from "express";
import { createRide, getRidesByUserId } from "../controllers/ridesController";

const router = express.Router();

router.post('/create', createRide);
router.get('/:id', getRidesByUserId);

export default router;
