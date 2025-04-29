import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .min(2)
    .max(255)
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      'string.pattern.base': 'firstName must contain only letters and numbers, no spaces',
      'string.min': 'firstName must be at least 2 characters long',
      'string.max': 'firstName cannot exceed 255 characters'
    }),
  lastName: Joi.string()
    .required()
    .min(2)
    .max(255)
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      'string.pattern.base': 'lastName must contain only letters and numbers, no spaces',
      'string.min': 'lastName must be at least 2 characters long',
      'string.max': 'lastName cannot exceed 255 characters'
    }),
  email: Joi.string()
    .required()
    .email()
    .max(255)
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email cannot exceed 255 characters'
    })
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(255),
  lastName: Joi.string().min(2).max(255),
  email: Joi.string().email().max(255),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

export const followUserSchema = Joi.object({
  followerId: Joi.number().required(),
});

export const userQuerySchema = Joi.object({
  limit: Joi.number().min(1).max(100).default(10),
  offset: Joi.number().min(0).default(0),
  type: Joi.string().valid('post', 'like', 'follow'),
  fromDate: Joi.date().iso(),
  toDate: Joi.date().iso().min(Joi.ref('fromDate')),
}).messages({
  'number.min': 'Limit must be at least 1',
  'number.max': 'Limit cannot exceed 100',
  'number.base': 'Offset must be a number',
  'string.valid': 'Type must be one of: post, like, follow',
  'date.base': 'Invalid date format',
});
