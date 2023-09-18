const path = require("path");
const debug= require('debug')('weblog-project');
const express = require("express");
const bodyParser=require("body-parser");
const passport = require("passport");
const expressLayout = require("express-ejs-layouts");
const dotEnv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const winston= require("./config/winston");
const flash = require("connect-flash");
const session = require("express-session");
//* Load Config
dotEnv.config({path: "./config/config.env"});

connectDB();
debug("connected To dataBase")
require("./config/passport");
const mongoose = require("mongoose");
const app = express();

//* log
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    app.use(morgan("combined",{stream:winston.stream}))
}
//* Session
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: "secret", cookie: {maxAge: null}, resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//* View Engine
app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/mainLayouts");
app.set("views", "views");
//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
//* Static Folder
app.use(express.static(path.join(__dirname, "public")));


//* Routes
app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/users", require("./routes/users"));
app.use((req, res) => {
    res.render("404", {pageTitle: "404| صفحه پیدا نشد", path: "/404"})
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
