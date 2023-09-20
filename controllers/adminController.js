const Blog = require("../models/Blog");
const {get500} = require("../controllers/errorController");
const {schema} = require("../models/validation/PostValidation");
const multer = require("multer");
const {storage, fileFilter} = require("../utils/multer")
const uuid = require("uuid").v4

exports.getDashboard = async (req, res) => {
    const blogs = await Blog.find({user: req.user.id});
    try {
        res.render("admin/blogs", {
            pageTitle: "بخش مدیریت داشبورد",
            path: "/dashboard",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            blogs: blogs,
        })
    } catch (err) {
        console.log(err);
        get500(req, res);

    }

};
exports.getAddPost = (req, res) => {
    try {

        res.render("admin/addPost", {
            pageTitle: "بخش مدیریت داشبورد",
            path: "/dashboard/add-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname
        })
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
}
exports.createPost = async (req, res) => {
    let status = Number(req.body.status);
    try {
        await Blog.create({
            title: req.body.title, body: req.body.body, status: status, user: req.user.id
        })

        res.redirect("/dashboard/add-post");
    } catch (err) {
        console.log(err);
        const {error} = schema.validate(req.body);
        if (error) {
            console.log(req.user.fullname);
            res.render("./admin/addPost", {
                pageTitle: "بخش مدیریت داشبورد",
                path: "/dashboard/add-post",
                layout: "./layouts/dashLayout",
                errors: error.details,
                fullname: req.user.fullname,

            });
        }
    }


}


exports.uploadImage = (req, res) => {
    // let fileName = `${uuid()}.jpg`;


    const upload = multer({
        limits: {fileSize: 4000000},
        dest: "uploads/",
        storage: storage,
        fileFilter: fileFilter,
    }).single("image");

    upload(req, res, (err) => {
        if (err) {
            res.send(err);
        } else {
            if (req.file) {
                res.status(200).send("آپلود عکس موفقیت آمیز بود");
            } else {
                res.send("جهت آپلود باید عکسی انتخاب کنید");
            }
        }
    });
}