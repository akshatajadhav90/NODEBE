const express = require("express");
const { add, getUsers, updateUsers, deletUsers, searchUsers, sorting } = require("../controllers/usersControllers");
const { authMiddleWre } = require("../middlewares/middlewares");
const { route } = require("./auth");
const router = express.Router();

router.post("/addUsers", authMiddleWre, add);

router.get("/getUsers", authMiddleWre, getUsers);

router.post("/updateUsers", authMiddleWre, updateUsers);

router.delete("/deletUsers", authMiddleWre, deletUsers)

router.post("/searchUser", authMiddleWre, searchUsers)

router.post("/sorting",authMiddleWre,sorting)

module.exports = router;