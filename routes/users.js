const {Router} = require("express");
const UserController = require("../controllers/AuthController");
const {authenticated} = require("../middlewares/auth");
const router = new Router();
router.get("/login", UserController.login);
router.post("/login", UserController.handleLogin);
router.get("/register", UserController.register);
router.post("/register", UserController.store);
router.get("/logout", authenticated, UserController.logout);

module.exports = router;
