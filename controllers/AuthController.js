const User = require("../models/User");
const {schema} = require("../models/validation/UserValidation");
const passport = require("passport");
const fetch = require("node-fetch");
const {sendEmail} = require("../utils/mailer");
const jwt = require("jsonwebtoken");
exports.login = (req, res) => {
    res.render("login", {
        pageTitle: "ورود به مدیریت",
        path: "/login",
        message: req.flash("success_message"),
        error: req.flash("error"),
    });
};

exports.handleLogin = async (req, res, next) => {
    // if (!req.body["g-recaptcha-response"]) {
    //     req.flash("error", "اعتبار سنجی کپچا الزامی میباشد")
    //     return res.redirect("/users/login");
    // }
    // const secretKey = process.env.CAPTCHA_SECRT;
    // const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`;
    //
    // const response = await fetch(verifyUrl, {
    //     method: "POST", headers: {
    //         Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    //     },
    // });
    // const json = await response.json();

    // if (json.success) {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true,
    })(req, res, next);
    // } else {
    //     req.flash("error", "اعتبار سنجی با مشکل مواجه شده")
    //     res.redirect("/users/login");
    //
    // }
};

exports.register = (req, res) => {
    res.render("register", {pageTitle: "صفحه ثبت نام ", path: "/register"});
};
exports.store = async (req, res) => {
    try {
        let email = req.body.email;
        const getUser = await User.findOne({email});
        if (getUser) {
            return res.render("register", {
                pageTitle: "ثبت نام کاربر",
                path: "/register",
                errors: [{message: '"email" is allrady '}],
            });
        }

        let user = {
            fullname: req.body.fullname,
            email: email,
            password: req.body.password,
        };
        await User.create(user);
        sendEmail(email, req.body.fullname, "خوش امدی به بلاگ", "خوش امدی ");
        req.flash("success_message", "ثبت نام موفقیت امیز بود ");
        res.redirect("/users/login");
    } catch (err) {
        const {error} = schema.validate(req.body);
        if (error) {
            console.log(error);
            return res.render("register", {
                pageTitle: "ثبت نام کاربر",
                path: "/register",
                errors: error.details,
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

exports.forgetPassword = async (req, res) => {
    res.render("forgetPass", {
        pageTitle: " فراموشی رمز عبور",
        path: "/login",
        message: req.flash("success_message"),
        error: req.flash("error"),
    });
};
exports.handleForgetPassword = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email: email});
    if (!user) {
        req.flash("error", "کاربری  با این ایمیل یافت نشد");
        return res.render("forgetPass", {
            pageTitle: " فراموشی رمز عبور",
            path: "/login",
            message: req.flash("success_message"),
            error: req.flash("error"),
        });
    }
    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    const resetLink = `http://localhost:5000/users/reset-password/${token}`;
    sendEmail(
        user.email,
        user.fullname,
        " فرااموشی رمز عبور",
        `
         جهت تغییر رمز عبور فعلی رو لینک کلیک کنید
        <a href="${resetLink}"> لینک تغییر رمز عبور </a>
        `
    );
    req.flash("success_message", " ایمیل حاوی لینک با موفقیت ارسال شد ");
    res.render("forgetPass", {
        pageTitle: " فراموشی رمز عبور",
        path: "/login",
        message: req.flash("success_message"),
        error: req.flash("error"),
    });
};
exports.restPassword = async (req, res) => {
    const token = req.params.token;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
    } catch (err) {
        console.log(err);
        if (!decodedToken) {
            return res.redirect("/404");
        }
    }

    res.render("resetPass", {
        pageTitle: " فراموشی رمز عبور",
        path: "/login",
        message: req.flash("success_message"),
        error: req.flash("error"),
        userId: decodedToken.userId,
    });
};
exports.handelRestPassword = async (req, res) => {
    const {password, confirmPassword} = req.body;
    if (password !== confirmPassword) {
        req.flash("error", "کلمه عبور یکسان  نیست")
        return res.render("resetPass", {
            pageTitle: " فراموشی رمز عبور",
            path: "/login",
            message: req.flash("success_message"),
            error: req.flash("error"),
            userId: req.params.id,
        });

    }
    const  user  = await User.findOne({_id:req.params.id});
    if (!user){
        console.log("ok");
        return  res.redirect("/404");
    }
    user.password= password;
    await user.save();

    req.flash("success_message","پسورد شما با موفقیت بروزرسانی شد");
    res.redirect("/users/login")


};
