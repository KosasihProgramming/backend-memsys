import express from "express";
import {
  createTable,
  seedingTable,
} from "../controllers/CreateTableController.js";

const router = express.Router();

router.get("/table-migration", createTable);
router.get("/table-seeding", seedingTable);

export default router;
