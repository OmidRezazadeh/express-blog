exports.getDashboard = async (req, res) => {
    res.render("admin/blogs", {
        pageTitle: "بخش مدیریت داشبورد",
        path: "/dashboard",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname
    })
};
exports.getAddPost = (req, res) => {
    res.render("admin/addPost", {
        pageTitle: "بخش مدیریت داشبورد",
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname
    })
}