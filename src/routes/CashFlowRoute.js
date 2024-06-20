import express from "express";
import { arusKas, detailArusKas } from "../controllers/CashFlowController.js";

const router = express.Router();

router.post("/arus-kas", arusKas);
router.post("/detail-arus-kas", detailArusKas);

export default router;
