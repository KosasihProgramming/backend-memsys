import express from "express";
import { arusKas, insertHistory } from "../controllers/CashFlowController.js";

const router = express.Router();

router.post("/arus-kas", arusKas);
router.post("/insert-history", insertHistory);

export default router;
