const router = require("express").Router();

// Controllers
const gptController = require("../controllers/gptController.js");

// Auth
router.post("/answer", gptController.answer);
router.post("/goodAnswer", gptController.goodAnswer);

module.exports = router;