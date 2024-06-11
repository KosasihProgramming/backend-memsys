const express = require("express");
const {
  arusKas,
  insertHistory,
} = require("../controllers/CashFlowController.js");

const router = express.Router();

router.post("/arus-kas", arusKas);
router.post("/insert-history", insertHistory);

module.exports = router;
