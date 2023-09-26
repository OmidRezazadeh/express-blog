const mime = require("mime-types");
const multer = require("multer");
const {fileFilter} = require("./multer");
exports.validation = (files) => {
  let message = null;
  if (files === null) {
    message = "No files were uploaded.";
  } else {
    const image = files.thumbnail;
    // Use mime.contentType() instead of mime.lookup() to get the MIME type
    const mimeType = mime.contentType(image.mimetype);

    if (!mimeType) {
      message = "MIME type not found for the uploaded file.";
    }
  }
  return message;
};
