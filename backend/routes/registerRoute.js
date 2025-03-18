// Set up express and router and /register path
const express = require("express");
const router = express.Router();

const { registerNewUser } = require("../controllers/userController");

router.post("/register", registerNewUser);

module.exports = router;
