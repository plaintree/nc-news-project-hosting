const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");

router.get("/", usersController.getUsers);
router.get("/:username", usersController.getUserByUsername);

module.exports = router;
