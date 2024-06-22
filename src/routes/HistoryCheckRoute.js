import express from "express";
import {
  insertHistory,
  insertDetailHistory,
  getHistory,
  getDetailHistory,
  getAllHistoryByUser,
} from "../controllers/HistoryCheckController.js";

const router = express.Router();

router.post("/history-check/insert", insertHistory);
router.post("/history-check/select", getHistory);
router.post("/history-check/by-user", getAllHistoryByUser);
router.post("/history-check-detail/insert", insertDetailHistory);
router.post("/history-check-detail/select", getDetailHistory);

export default router;
