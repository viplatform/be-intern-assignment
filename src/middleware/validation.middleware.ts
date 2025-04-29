import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { createApiResponse } from '../types/response';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate({
      ...req.body,
      ...req.query,
      ...req.params
    });
    if (error) {
      return res.status(400).json(createApiResponse(
        [],
        10,
        0,
        0,
        `Validation Error: ${error.details[0].message}`,
        400
      ));
    }
    next();
  };
};

export const validateRequest = validate;
