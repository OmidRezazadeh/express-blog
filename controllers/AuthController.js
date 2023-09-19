const User = require("../models/User");
const {schema} = require("../models/validation/UserValidation");
const passport = require("passport");
const fetch = require("node-fetch");

exports.login = (req, res) => {
    res.render("login", {
        pageTitle: "ورود به مدیریت", path: "/login", message: req.flash("success_message"), error: req.flash("error")
    });
};

exports.handleLogin = async (req, res, next) => {
    if (!req.body["g-recaptcha-response"]) {
        req.flash("error", "اعتبار سنجی کپچا الزامی میباشد")
        return res.redirect("/users/login");
    }
    const secretKey = process.env.CAPTCHA_SECRT;
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`;

    const response = await fetch(verifyUrl, {
        method: "POST", headers: {
            Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
    });
    const json = await response.json();


    if (json.success) {
        passport.authenticate("local", {
            successRedirect: "/dashboard", failureRedirect: "/users/login", failureFlash: true,
        })(req, res, next);
    } else {
        req.flash("error", "اعتبار سنجی با مشکل مواجه شده")
        res.redirect("/users/login");

    }
}


exports.register = (req, res) => {
    res.render("register", {pageTitle: "صفحه ثبت نام ", path: "/register"});
};
exports.store = async (req, res) => {

    try {
        let email = req.body.email;
        const getUser = await User.findOne({email});
        if (getUser) {
            return res.render("register", {
                pageTitle: "ثبت نام کاربر", path: "/register", errors: [{message: '"email" is allrady '}],
            });
        }


        let user = {
            fullname: req.body.fullname, email: email, password: req.body.password,
        };
        await User.create(user);
        req.flash("success_message", "ثبت نام موفقیت امیز بود ")
        res.redirect("/users/login");
    } catch (err) {
        const {error} = schema.validate(req.body);
        if (error) {
            console.log(error);
            return res.render("register", {
                pageTitle: "ثبت نام کاربر", path: "/register", errors: error.details,
            });
        }
    }
};

exports.logout = (req, res, next) => {
    req.session = null;
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success_message", "خروج موفقیت امیز بود");
        res.redirect("/users/login");
    });
};
