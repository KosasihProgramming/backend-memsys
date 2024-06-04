import express from "express";
import { getIndex } from "../controllers/HomeController.js";

const router = express.Router();

router.get("/", getIndex);

export default router;
