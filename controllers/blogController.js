const Blog = require("../models/Blog");
const captchapng = require('captchapng');
const {truncate} = require("../utils/truncate");
const Contact = require("../models/Contact");
const {schema: contactSchema} = require("../models/validation/ContactValidation");
const {schema} = require("../models/validation/PostValidation");
const {sendEmail} = require("../utils/mailer");
const buffer = require("buffer");
const {get500} = require("./errorController");

let CAPTCHA_NUM;
exports.getIndex = async (req, res) => {
    const page = req.query.page || 1;
    const limit = 2;
    try {
        const options = {
            page, limit,
        };

        const posts = await Blog.paginate({status: 0}, options);
        res.render("index", {
            pageTitle: "وبلاگ",
            pages: posts.pages,
            current: page,
            posts: posts.docs,
            totalPages: posts.total,
            path: "/",
            truncate

        });
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};
exports.getSinglePost = async (req, res) => {
    try {
        const post = await Blog.findOne({_id: req.params.id}).populate("user");
        console.log(post);
        if (!post) return res.redirect("errors/404");
        res.render("post", {
            pageTitle: post.title, path: "/post", post: post,
        });
    } catch (err) {
        console.log(err);
        res.render("errors/500");
    }
};
exports.getContactPage = (req, res) => {
    res.render("contact", {
        pageTitle: " تماس باما", path: "/contact", message: req.flash("success_message"), error: req.flash("error"),
    });
}
exports.handlerContact = async (req, res) => {

    let errors = [];
        const page = req.query.page || 1;
        const limit = 2;
        try {
            const options = {
                page, limit,
            };

            if (parseInt(req.body.captcha) === CAPTCHA_NUM) {
                const {email, message, fullname} = req.body;
                // Create the contact record
                const newContact = new Contact({fullname, email, message});
                await newContact.save(); // Save the contact record

                // Send email
                sendEmail(email, fullname, "پیام از طرف وبلاگ", `${message} <br/> ایمیل کاربر : ${email}`);
                return res.render("contact", {
                    pageTitle: "تماس با ما",
                    path: "/contact",
                    message: req.flash("success_message"),
                    error: req.flash("error"),
                    errors: errors,
                })
            }
            errors.push('کپچا نامعتبر است');
            res.render("contact", {
                pageTitle: "تماس با ما",
                path: "/contact",
                message: req.flash("success_message"),
                error: req.flash("error"),
                errors: errors,
            })

        } catch (err) {

            const {error} = contactSchema.validate(req.body);
            let errorMessage = null;


            if (typeof error !== "undefined") {
                if (error.details[0]["message"].length > 0) {
                    console.log(error.details[0]["message"]);
                    errorMessage = error.details[0]["message"];
                    errors.push(errorMessage);
                }
            }

            res.render("contact", {
                pageTitle: "تماس با ما",
                path: "/contact",
                message: req.flash("success_message"),
                error: req.flash("error"),
                errors: errors,
            });
        }


}
    exports.getCaptcha = (req, res) => {
        CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
        const p = new captchapng(80, 30, CAPTCHA_NUM);
        p.color(0, 0, 0, 0);
        p.color(80, 80, 255);
        const img = p.getBase64();
        const imgBase64 = Buffer.from(img, "base64");
        res.send(imgBase64);
    }
    exports.handlerSearch = async (req, res) => {
        const page = req.query.page || 1;
        const limit = 2;
        try {
            const options = {
                page, limit,
            };
            const searchText = req.body.search || ''; // Get the search text or use an empty string if not provided
            const result = await Blog.paginate({$text: {$search: searchText}}, options);


            res.render("index", {
                pageTitle: "وبلاگ",
                path: "/",
                current: page,
                pages: result.pages,
                posts: result.docs,
                totalPages: result.total,
                truncate
            });
        } catch (err) {
            console.log(err);
            res.render("errors/500", {
                pageTitle: "500| خطای سرور", path: "/404"
            })
        }

    }