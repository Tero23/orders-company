const router = require("express").Router();
const userController = require("../controllers/user");

router.route("/signup").post(userController.createUser);
router.route("/login").post(userController.loginUser);
router.route("/").get(userController.getUserData);

module.exports = router;
