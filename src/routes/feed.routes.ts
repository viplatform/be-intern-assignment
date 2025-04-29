import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { feedQuerySchema } from '../validations/feed.validation';
import { FeedController } from '../controllers/feed.controller';

export const feedRouter = Router();
const feedController = new FeedController();

// Get user's personalized feed (matches README: /api/feed)
feedRouter.get('/', 
    validate(feedQuerySchema), 
    feedController.getUserFeed.bind(feedController)
);
