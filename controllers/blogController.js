const Blog = require("../models/Blog");
const {formatDate} = require("../utils/jalali");
exports.getIndex = async (req, res) => {
    try {
        const posts = await Blog.find({status: 0}).sort({createdAt: "desc"});
        res.render("index", {
            "pageTitle": "وبلاگ",
            path: "/",
            posts
        })
    } catch (err) {
        console.log(err);
        res.render("errors/500")
    }
}