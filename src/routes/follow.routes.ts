import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createFollowSchema } from '../validations/follow.validation';
import { FollowController } from '../controllers/follow.controller';

export const followRouter = Router();
const followController = new FollowController();

followRouter.get('/', followController.getAllFollows.bind(followController));

followRouter.get('/user/:userId/following', followController.getFollowing.bind(followController));

followRouter.get('/:id', followController.getFollowById.bind(followController));

followRouter.post('/', validate(createFollowSchema), followController.createFollow.bind(followController));

followRouter.delete('/:id', followController.deleteFollow.bind(followController));

followRouter.post('/unfollow', validate(createFollowSchema), followController.unfollow.bind(followController));
