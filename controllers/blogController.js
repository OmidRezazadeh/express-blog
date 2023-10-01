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
        const post = await Blog.findOne({_id: req.params.id})
            .populate("user")
        console.log(post);
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
exports.getContactPage=(req,res)=>{
    res.render("contact",{
        pageTitle:" تماس باما",
        path:"/contact",
        message:req.flash("success_message"),
        error:req.flash("error"),
 
    });

exports.handlerContact=(req,res)=>{
    
}    
}