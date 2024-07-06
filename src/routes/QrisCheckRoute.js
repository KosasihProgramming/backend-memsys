import express from "express";
import { qrisCheck } from "../controllers/QrisCheckController.js";

const router = express.Router();

router.post("/qris/check", qrisCheck);

export default router;
