import Joi from 'joi';

// Similar to Django Form validation
export const createPostSchema = Joi.object({
    authorId: Joi.number().required(),
    content: Joi.string().required().max(1000),
    hashtags: Joi.array().items(Joi.string().pattern(/^[a-zA-Z0-9_]+$/)).default([])
});

export const updatePostSchema = Joi.object({
    content: Joi.string().required().max(1000)
});

export const likePostSchema = Joi.object({
    userId: Joi.number().required()
});

export const postQuerySchema = Joi.object({
    limit: Joi.number().min(1).max(100).default(10),
    offset: Joi.number().min(0).default(0)
});