// Set up express and router and /login path
const express = require("express");
const router = express.Router();

const { userLoginController } = require("../controllers/userController");

router.get("/", userLoginController);

module.exports = router;
