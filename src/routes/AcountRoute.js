import express from "express";
import { acountsIndex } from "../controllers/AccountController.js";

const router = express.Router();

router.get("/accounts", acountsIndex);

export default router;
