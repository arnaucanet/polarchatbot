const express = require("express");
const healthRoutes = require("./healthRoutes");
const chatRoutes = require("./chatRoutes");

const router = express.Router();

router.use("/", healthRoutes);
router.use("/api/v1", chatRoutes);

module.exports = router;
