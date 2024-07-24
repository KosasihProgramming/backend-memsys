import express from "express";
import {
  getPendapatan,
  getPendapatanBulanan,
  getCabangKlinik,
  insertPendapatanBulanan,
} from "../controllers/OmsetController.js";

const router = express.Router();

router.get("/omset", getPendapatan);
router.get("/omset/cabang", getCabangKlinik);
router.get("/omset/bulanan", getPendapatanBulanan);
router.get("/omset/bulanan/insert", insertPendapatanBulanan);

export default router;
