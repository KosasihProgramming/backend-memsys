import express from "express";
import {
  getAllPendapatanBpjs,
  insertPendapatanBpjs,
  updatePendapatanBpjs,
} from "../controllers/BpjsController.js";

const router = express.Router();

router.get("/bpjs/cek", getAllPendapatanBpjs);
router.get("/bpjs/insert", insertPendapatanBpjs);
router.get("/bpjs/update", updatePendapatanBpjs);

export default router;
