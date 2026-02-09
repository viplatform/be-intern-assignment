import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createHashtagSchema, updateHashtagSchema } from '../validations/hashtag.validation';
import { HashtagController } from '../controllers/hashtag.controller';

export const hashtagRouter = Router();
const hashtagController = new HashtagController();

hashtagRouter.get('/', hashtagController.getAllHashtags.bind(hashtagController));

hashtagRouter.get('/:id', hashtagController.getHashtagById.bind(hashtagController));

hashtagRouter.post('/', validate(createHashtagSchema), hashtagController.createHashtag.bind(hashtagController));

hashtagRouter.put('/:id', validate(updateHashtagSchema), hashtagController.updateHashtag.bind(hashtagController));

hashtagRouter.delete('/:id', hashtagController.deleteHashtag.bind(hashtagController));
