const passport = require("passport");
const { Strategy } = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

passport.use(
    new Strategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, {
                    message: "کاربری با این ایمیل ثبت نشده",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user); //req.user
            } else {
                return done(null, false, {
                    message: "نام کاربری یا کلمه عبور صحیح نمی باشد",
                });
            }
        } catch (err) {
            console.log(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err, null);
        });
});
