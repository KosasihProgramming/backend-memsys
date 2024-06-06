import express from "express";
import {
  getCashflow,
  balanceCek,
  arusKas,
} from "../controllers/CashFlowController.js";

const router = express.Router();

router.post("/cashflow", getCashflow);
router.post("/balance-cek", balanceCek);
router.post("/arus-kas", arusKas);

export default router;
