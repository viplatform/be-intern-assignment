import Joi from 'joi';

export const paginationQuerySchema = Joi.object({
    limit: Joi.number().min(1).max(100).default(10),
    offset: Joi.number().min(0).default(0)
});