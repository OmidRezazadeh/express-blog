const Blog = require("../models/Blog");
const {get500} = require("../controllers/errorController");
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
        get500(req,res);

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
    }catch (err){
        console.log(err);
        get500(req,res);
    }
}
exports.createPost = async (req, res) => {
console.log(req.user);
    try {
        await Blog.create({
            title: req.body.title,
            body: req.body.body,
            status: req.body.status,
            user: req.user.id
        })
        console.log(req.body);
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        get500(req,res);
    }
}