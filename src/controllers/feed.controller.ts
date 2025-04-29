import { Request, Response } from 'express';
import { FeedService } from '../services/feed.service';
import { createApiResponse } from '../types/response';

export class FeedController {
    private feedService = new FeedService();

    async getUserFeed(req: Request, res: Response) {
        try {
            const userId = Number(req.params.userId);
            const limit = Number(req.query.limit) || 10;
            const offset = Number(req.query.offset) || 0;

            const { items, total } = await this.feedService.getUserFeed(userId, { limit, offset });
            
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
