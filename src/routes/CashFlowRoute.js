import express from "express";
import { getCashflow, balanceCek } from "../controllers/CashFlowController.js";

const router = express.Router();

router.post("/cashflow", getCashflow);
router.post("/balance-cek", balanceCek);

export default router;
