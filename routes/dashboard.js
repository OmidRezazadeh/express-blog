const {Router} = require('express');
const {authenticated} = require("../middlewares/auth");
const router = new Router();
const adminController = require("../controllers/adminController");

router.get("/", authenticated, adminController.getDashboard);
router.get('/add-post', adminController.getAddPost);
router.post('/add-post', adminController.createPost);
router.get("/login", (req, res) => {
    res.render("login", {pageTitle: "ورود به بخش مدیریت", path: "/login"});
})
router.get('getAddPost')
module.exports = router;