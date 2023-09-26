const mime = require("mime-types");
exports.validation = (files) => {
  let message = null;
  if (files === null) {
    message = "No files were uploaded.";
  } else {
    const image = files.thumbnail;
    const mimeType = mime.contentType(image.mimetype);
    if(mimeType !== 'image/jpeg' || mimeType !== 'image/png'){
      message = "MIME type not found for the uploaded file.";
    }
  }
  return message;
};
