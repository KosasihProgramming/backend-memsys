import express from "express";
import { uangKurang, uangLebih } from "../controllers/JournalController.js";

const router = express.Router();

router.post("/journal/kurang", uangKurang);
router.post("/journal/lebih", uangLebih);

export default router;
