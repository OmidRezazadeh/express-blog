const mime = require("mime-types");
exports.validation = (files) => {
  let message = null;
  if (files === null) {
    message = "No files were uploaded.";
  } else {
    const image = files.thumbnail;
    const mimeType = mime.contentType(image.mimetype);
  
   const mimeTypeArray=["image/jpeg","image/png"]

    if(!mimeTypeArray.includes(mimeType)){
      message = "MIME type not found for the uploaded file.";
    }
  }
  return message;
};
