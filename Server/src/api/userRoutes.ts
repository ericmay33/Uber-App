import express, { Request, Response } from "express";
import { signUp, signIn, getUser } from "../controllers/userController";

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/user', getUser);

export default router;
