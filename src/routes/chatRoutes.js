const express = require("express");
const apiKeyAuth = require("../middlewares/apiKeyAuth");
const { chatRateLimit } = require("../middlewares/security");
const { chat } = require("../controllers/chatController");

const router = express.Router();

router.post("/chat", chatRateLimit, apiKeyAuth, chat);

module.exports = router;
