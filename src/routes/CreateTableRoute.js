const express = require("express");
const {
  createTable,
  seedingTable,
} = require("../controllers/CreateTableController.js");

const router = express.Router();

router.get("/table-migration", createTable);
router.get("/table-seeding", seedingTable);

module.exports = router;
