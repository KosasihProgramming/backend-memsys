import express from "express";
import {
  arusKas,
  detailArusKas,
  insertHistory,
} from "../controllers/CashFlowController.js";

const router = express.Router();

router.post("/arus-kas", arusKas);
router.post("/detail-arus-kas", detailArusKas);
router.post("/insert-history", insertHistory);

export default router;
