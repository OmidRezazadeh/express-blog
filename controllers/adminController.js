const Blog = require("../models/Blog");
const {get500} = require("../controllers/errorController");
const {schema} = require("../models/validation/PostValidation");
const multer = require("multer");
const sharp = require('sharp');
const uuid = require("uuid").v4;
const shortId = require("shortid");


const {storage, fileFilter} = require("../utils/multer")


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
    const upload = multer({
        limits: {fileSize: 4000000},

        fileFilter: fileFilter,
    }).single("image");

    upload(req, res, async (err) => {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res
                    .status(400)
                    .send("حجم عکس نباید بیشتر از 4مگابایت باشد")
            }
        } else {
            if (req.file) {
                const fileName = `${shortId.generate()}_${req.file.originalname}`;
                await sharp(req.file.buffer).png({
                    quality: 60
                })
                    .toFile(`./public/uploads/${fileName}`)
                res.json({"message":"","address":""});
                res.status(200).send(`http://localhost:5000/uploads/${fileName}`);
            } else {
                res.send("جهت آپلود باید عکسی انتخاب کنید");
            }
        }
    });
}