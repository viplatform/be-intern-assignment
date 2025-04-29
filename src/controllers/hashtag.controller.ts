import { Request, Response } from 'express';
import { HashtagService } from '../services/hashtag.service';
import { createApiResponse } from '../types/response';

export class HashtagController {
    private hashtagService = new HashtagService();

    async getPostsByHashtag(req: Request, res: Response) {
        try {
            const tag = req.params.tag;
            const limit = Number(req.query.limit) || 10;
            const offset = Number(req.query.offset) || 0;

            const { items, total } = await this.hashtagService.getPostsByHashtag(tag, { limit, offset });

            return res.json(createApiResponse(
                items,
                limit,
                offset,
                total
            ));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            return res.status(500).json(createApiResponse(
                [],
                10,
                0,
                0,
                message
            ));
        }
    }
}
