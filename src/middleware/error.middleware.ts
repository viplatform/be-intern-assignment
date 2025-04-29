import { Request, Response, NextFunction } from 'express';
import { createApiResponse } from '../types/response';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json(createApiResponse(
            [],
            10,
            0,
            0,
            'Validation Error: ' + err.message,
            400
        ));
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json(createApiResponse(
            [],
            10,
            0,
            0,
            'Authentication Error: ' + err.message,
            401
        ));
    }

    return res.status(500).json(createApiResponse(
        [],
        10,
        0,
        0,
        process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
        500
    ));
};
