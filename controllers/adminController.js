const Blog = require("../models/Blog");
const fs = require("fs");
const { get500 } = require("../controllers/errorController");
const { schema } = require("../models/validation/PostValidation");
const validationImage = require("../utils/image");
const appRoot = require("app-root-path");
const sharp = require("sharp");
const uuid = require("uuid").v4;
const shortId = require("shortid");
exports.getDashboard = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 2;
  try {
    const options = {
      page,
      limit,
    };
    const result = await Blog.paginate({ user: req.user.id }, options);

    res.render("admin/blogs", {
      pageTitle: "بخش مدیریت داشبورد",
      path: "/dashboard",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      current: page,
      pages: result.pages,
      blogs: result.docs,
      totalPages: result.total,
    });
  } catch (err) {
    get500(req, res);
  }
};
exports.getAddPost = (req, res) => {
  try {
    res.render("admin/addPost", {
      pageTitle: "بخش مدیریت داشبورد",
      path: "/dashboard/add-post",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
    });
  } catch (err) {
    get500(req, res);
  }
};
exports.createPost = async (req, res) => {
  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnail/${fileName}`;

  let status = Number(req.body.status);
  try {
    await sharp(thumbnail.data).jpeg({ quality: 60 }).toFile(uploadPath);
    await Blog.create({
      title: req.body.title,
      body: req.body.body,
      status: status,
      user: req.user.id,
      thumbnail: fileName,
    });

    res.redirect("/dashboard/add-post");
  } catch (err) {
    const { error } = schema.validate(req.body);

    let errorMessage = null;
    let errors = [];

    if (typeof error !== "undefined") {
      if (error.details[0]["message"].length > 0) {
        errorMessage = error.details[0]["message"];
        errors.push(errorMessage);
      }
    }

    const imageErrorMessage = validationImage.validation(req.files);
    if (imageErrorMessage !== null) {
      errors.push(imageErrorMessage);
    }

    res.render("./admin/addPost", {
      pageTitle: "بخش مدیریت داشبورد",
      path: "/dashboard/add-post",
      layout: "./layouts/dashLayout",
      errors: errors,
      fullname: req.user.fullname,
    });
  }
};

exports.EditPost = async (req, res) => {
  const post = await Blog.findOne({ _id: req.params.id });
  let fileName = null;
  let isUpdate = false;

  try {
    if (!post) {
      return res.redirect("/errors/404"); // Use the correct path for your 404 error page
    }
    if (post.user.toString() !== req.user.id) {
      return res.redirect("/dashboard");
    } else {
      if (req.files === null) {
        fileName = post.thumbnail;
      } else {
        isUpdate = true;
        const thumbnail = req.files.thumbnail;
        fileName = `${shortId.generate()}_${thumbnail.name}`;
        const uploadPath = `${appRoot}/public/uploads/thumbnail/${fileName}`;
        
        // Remove the previous thumbnail
        fs.unlinkSync(`${appRoot}/public/uploads/thumbnail/${post.thumbnail}`);
        
        // Use Promises to handle sharp operations
        await sharp(thumbnail.data)
          .jpeg({ quality: 60 })
          .toFile(uploadPath);

      }

      const { title, status, body } = req.body;
      post.title = title;
      post.status = status;
      post.body = body;
      post.thumbnail = fileName;
      await post.save();

      return res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);

    let errors = [err.message]; // Use a better error handling strategy

    if (isUpdate === true) {
      const imageErrorMessage = validationImage.validation(req.files); // Ensure validationImage is defined
      if (imageErrorMessage !== null) {
        errors.push(imageErrorMessage);
      }
    }

    res.render("./admin/editPost", {
      pageTitle: "بخش مدیریت داشبورد",
      path: "/dashboard/edit-post",
      layout: "./layouts/dashLayout",
      errors: errors,
      fullname: req.user.fullname,
      post,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.redirect("/dashboard");
  } catch (err) {
    res.render("errors/500");
  }
};

exports.getEditPost = async (req, res) => {
  const post = await Blog.findOne({ _id: req.params.id });
  if (!post) {
    return res.redirect("errors/404");
  }
  if (post.user.toString() !== req.user.id) {
    return res.redirect("/dashboard");
  } else {
    res.render("./admin/editPost", {
      pageTitle: "بخش ,ویرایش داشبورد",
      path: "/dashboard/edit-post",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      post,
    });
  }
};

exports.uploadImage = (req, res) => {
  console.log("ok");
  const upload = multer({
    limits: { fileSize: 4000000 }, // dest: "uploads/",
    // storage: storage,
    fileFilter: fileFilter,
  }).single("image");
  //req.file
  // console.log(req.file)

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .send("حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد");
      }
      res.status(400).send(err);
    } else {
      if (req.file) {
        const fileName = `${shortId.generate()}_${req.file.originalname}`;
        await sharp(req.file.buffer)
          .png({
            quality: 60,
          })
          .toFile(`./public/uploads/${fileName}`)
          .catch((err) => console.log(err));
        res.status(200).send(`http://localhost:3000/uploads/${fileName}`);
      } else {
        res.send("جهت آپلود باید عکسی انتخاب کنید");
      }
    }
  });
};

