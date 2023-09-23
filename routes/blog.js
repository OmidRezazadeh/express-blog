const {Router} = require("express");
const  blogController = require("../controllers/blogController");
const router = new Router();
router.get("/", blogController.getIndex);
module.exports= router;