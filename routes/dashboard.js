const {Router} = require('express');
const {authenticated} = require("../middlewares/auth");
const router = new Router();
const adminController = require("../controllers/adminController");

router.get("/", authenticated, adminController.getDashboard);
router.get('/add-post', adminController.getAddPost);
router.post('/add-post', adminController.createPost);
router.get("/edit-post/:id", authenticated,adminController.getEditPost);
router.post("/edit-post/:id", authenticated,adminController.EditPost)
router.get("/delete-post/:id", authenticated, adminController.deletePost)
router.post("/image-upload", authenticated,adminController.uploadImage);
router.get("/login", (req, res) => {
    res.render("login", {pageTitle: "ورود به بخش مدیریت", path: "/login"});
})

router.get('getAddPost')
module.exports = router;