import express from "express";
import {
  getAllPendapatan,
  getPerusahaan,
  insertPendapatanKlinik,
  insertPendapatanLab,
  insertPendapatanGigi,
  updatePendapatanKlinik,
  updatePendapatanLab,
  updatePendapatanGigi,
} from "../controllers/PendapatanController.js";

const router = express.Router();

router.get("/pendapatan/cek", getAllPendapatan);
router.get("/pendapatan/cabang-perusahaan/:namaKlinik", getPerusahaan);
router.get("/pendapatan/klinik", insertPendapatanKlinik);
router.get("/pendapatan/lab", insertPendapatanLab);
router.get("/pendapatan/gigi", insertPendapatanGigi);
router.get("/pendapatan/update/klinik", updatePendapatanKlinik);
router.get("/pendapatan/update/lab", updatePendapatanLab);
router.get("/pendapatan/update/gigi", updatePendapatanGigi);

export default router;
