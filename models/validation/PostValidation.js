const Joi = require('joi');
exports.schema = Joi.object({
    status: Joi.valid('0', '1').messages({
        'any.required': 'status is required',
        'string.valid': ' لطفا یک مورد را انتخاب کنید ',
    }), title: Joi
        .string()
        .required()
        .messages({
            'string.title': 'title must be a valid email address', 'any.required': 'title is required',
        }),
    body: Joi.string().required().messages({
        'string.body': 'body must be a valid email address', 'any.required': 'body is required',
    }),
});