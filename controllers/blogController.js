const Blog = require("../models/Blog");
const {truncate} = require("../utils/truncate");

exports.getIndex = async (req, res) => {
    try {
        const posts = await Blog.find({status: 0}).sort({createdAt: "desc"});
        res.render("index", {
            "pageTitle": "وبلاگ",
            path: "/",
            posts: posts,
            truncate
        })
    } catch (err) {
        console.log(err);
        res.render("errors/500")
    }
};
exports.getSinglePost = async (req, res) => {
    try {
        const post = await Blog.findOne({id: req.params.id})
            .populate("user")
        if (!post) return res.redirect("errors/404");
        res.render("post", {
            pageTitle: post.title,
            path: "/post",
            post: post
        });
    } catch (err) {
        console.log(err);
        res.render("errors/500")
    }
}