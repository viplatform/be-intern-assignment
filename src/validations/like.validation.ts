import Joi from 'joi';

export const createLikeSchema = Joi.object({
  userId: Joi.number().required().integer().positive().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be a positive number',
    'any.required': 'User ID is required',
  }),
  postId: Joi.number().required().integer().positive().messages({
    'number.base': 'Post ID must be a number',
    'number.integer': 'Post ID must be an integer',
    'number.positive': 'Post ID must be a positive number',
    'any.required': 'Post ID is required',
  }),
});
