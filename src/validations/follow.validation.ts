import Joi from 'joi';

export const createFollowSchema = Joi.object({
  followerId: Joi.number().required().integer().positive().messages({
    'number.base': 'Follower ID must be a number',
    'number.integer': 'Follower ID must be an integer',
    'number.positive': 'Follower ID must be a positive number',
    'any.required': 'Follower ID is required',
  }),
  followingId: Joi.number().required().integer().positive().messages({
    'number.base': 'Following ID must be a number',
    'number.integer': 'Following ID must be an integer',
    'number.positive': 'Following ID must be a positive number',
    'any.required': 'Following ID is required',
  }),
})
  .custom((value, helpers) => {
    if (value.followerId === value.followingId) {
      return helpers.error('any.invalid', { message: 'Users cannot follow themselves' });
    }
    return value;
  })
  .messages({
    'any.invalid': 'Users cannot follow themselves',
  });
