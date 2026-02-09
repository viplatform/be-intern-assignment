import Joi from 'joi';

export const createPostSchema = Joi.object({
  content: Joi.string().required().min(1).max(5000).messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 1 character long',
    'string.max': 'Content cannot exceed 5000 characters',
  }),
  userId: Joi.number().required().integer().positive().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be a positive number',
    'any.required': 'User ID is required',
  }),
  hashtags: Joi.array().items(Joi.string().min(1).max(100)).optional().messages({
    'array.base': 'Hashtags must be an array',
    'string.min': 'Hashtag must be at least 1 character long',
    'string.max': 'Hashtag cannot exceed 100 characters',
  }),
});

export const updatePostSchema = Joi.object({
  content: Joi.string().min(1).max(5000).messages({
    'string.min': 'Content must be at least 1 character long',
    'string.max': 'Content cannot exceed 5000 characters',
  }),
  hashtags: Joi.array().items(Joi.string().min(1).max(100)).optional().messages({
    'array.base': 'Hashtags must be an array',
    'string.min': 'Hashtag must be at least 1 character long',
    'string.max': 'Hashtag cannot exceed 100 characters',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
