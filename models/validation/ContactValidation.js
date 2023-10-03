const Joi = require("joi");
exports.schema = Joi.object({
  fullname: Joi.string().required().messages({
    "string.fullname": " لطفا نام خود را وارد کنید",
    "any.required": "status is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  message: Joi.string().required().messages({
    "string.message": "message must be a valid email address",
    "any.required": "message is required",
  }),
  captcha:Joi.required().messages({
    "any.required": "captcha is required",
  })

});
