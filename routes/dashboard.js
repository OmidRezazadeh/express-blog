const {Router} = require('express');
const {authenticated} =require("../middlewares/auth");
const router = new Router();

router.get("/",authenticated,(req,res)=>{
   res.render('dashboard',{
      pageTitle:"بخش مدیریت داشبورد ",
      path:"/dashboard",
      layout:'./layouts/dashLayout',
      fullname: req.user.fullname
   });
});

router.get("/login",(req, res)=>{
    res.render("login", {pageTitle:"ورود به بخش مدیریت",path:"/login"});
})
module.exports=router;