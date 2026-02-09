import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createLikeSchema } from '../validations/like.validation';
import { LikeController } from '../controllers/like.controller';

export const likeRouter = Router();
const likeController = new LikeController();

likeRouter.get('/', likeController.getAllLikes.bind(likeController));

likeRouter.get('/post/:postId', likeController.getLikesForPost.bind(likeController));

likeRouter.get('/:id', likeController.getLikeById.bind(likeController));

likeRouter.post('/', validate(createLikeSchema), likeController.createLike.bind(likeController));

likeRouter.delete('/:id', likeController.deleteLike.bind(likeController));

likeRouter.post('/unlike', validate(createLikeSchema), likeController.unlikePost.bind(likeController));
