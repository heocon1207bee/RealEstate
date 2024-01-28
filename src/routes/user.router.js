const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getUserByEmail);
router.post("/signup", userController.signUp);

module.exports = router;
