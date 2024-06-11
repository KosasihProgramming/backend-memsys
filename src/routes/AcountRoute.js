const express = require("express");
const { acountsIndex } = require("../controllers/AccountController.js");

const router = express.Router();

router.get("/accounts", acountsIndex);

module.exports = router;
