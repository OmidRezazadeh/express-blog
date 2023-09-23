const {Router} = require("express");
const blogController = require("../controllers/blogController");
const router = new Router();
router.get("/", blogController.getIndex);
router.get("/post/:id", blogController.getSinglePost);
module.exports = router;