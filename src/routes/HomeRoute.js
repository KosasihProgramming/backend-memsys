const express = require("express");
const { getIndex } = require("../controllers/HomeController.js");

const router = express.Router();

router.get("/", getIndex);

module.exports = router;
