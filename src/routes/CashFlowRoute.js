import express from "express";
import { getCashflow } from "../controllers/CashFlowController.js";

const router = express.Router();

router.post("/cashflow", getCashflow);

export default router;
