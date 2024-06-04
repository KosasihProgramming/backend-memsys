import express from "express";
import { acountsIndex } from "../controllers/AccountController.js";

const router = express.Router();

router.get("/acounts", acountsIndex);

export default router;
