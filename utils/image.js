const mime = require("mime-types");
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

    if (!mimeType.startsWith("image")) {
      message = "Only images are allowed";
    }
  }
  return message;
};
