import Joi from 'joi';

// Similar to Django Form validation
export const feedQuerySchema = Joi.object({
    limit: Joi.number().min(1).max(100).default(10),
    offset: Joi.number().min(0).default(0),
    userId: Joi.number().required()
});