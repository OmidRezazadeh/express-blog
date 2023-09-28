const Joi = require('joi');
const User = require("../User");
exports.schema = Joi.object({
    fullname:Joi.string().required().min(4).max(255).alphanum() 
    .messages({
        'any.required': 'Full name is required',
        'string.min': 'Full name must be at least 4 characters',
        'string.max': 'Full name cannot exceed 255 characters',
    }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),
    password:Joi.string().min(4).max(255).required() 
    .messages({
        'string.min': 'Password must be at least 4 characters',
        'string.max': 'Password cannot exceed 255 characters',
        'any.required': 'Password is required'
    }),

    confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Confirm password')  
    .messages({
        'any.only': 'Confirm password must match password',
        'any.required': 'Confirm password is required'
    }),
});
