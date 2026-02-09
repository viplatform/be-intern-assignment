import Joi from 'joi';

export const createHashtagSchema = Joi.object({
  name: Joi.string().required().min(1).max(100).messages({
    'string.empty': 'Hashtag name is required',
    'string.min': 'Hashtag name must be at least 1 character long',
    'string.max': 'Hashtag name cannot exceed 100 characters',
  }),
});

export const updateHashtagSchema = Joi.object({
  name: Joi.string().min(1).max(100).messages({
    'string.min': 'Hashtag name must be at least 1 character long',
    'string.max': 'Hashtag name cannot exceed 100 characters',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
