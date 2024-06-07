import express from "express";
import { arusKas } from "../controllers/CashFlowController.js";

const router = express.Router();

router.post("/arus-kas", arusKas);

export default router;
