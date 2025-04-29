import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { 
    createPostSchema, 
    updatePostSchema, 
    likePostSchema,
    postQuerySchema 
} from '../validations/post.validation';
import { hashtagQuerySchema } from '../validations/hashtag.validation';
import { PostController } from '../controllers/post.controller';
import { HashtagController } from '../controllers/hashtag.controller';

export const postRouter = Router();
const postController = new PostController();
const hashtagController = new HashtagController();

// Get all posts
postRouter.get('/', 
    validate(postQuerySchema), 
    postController.getPosts.bind(postController)
);

// Get post by id
postRouter.get('/:id', 
    postController.getPosts.bind(postController)
);

// Get posts by hashtag (matches README: /api/posts/hashtag/:tag)
postRouter.get('/hashtag/:tag',
    validate(hashtagQuerySchema),
    hashtagController.getPostsByHashtag.bind(hashtagController)
);

// Create new post
postRouter.post('/', 
    validate(createPostSchema), 
    postController.createPost.bind(postController)
);

// Update post
postRouter.put('/:id', 
    validate(updatePostSchema), 
    postController.updatePost.bind(postController)
);

// Delete post
postRouter.delete('/:id',
    postController.deletePost.bind(postController)
);

// Like post
postRouter.post('/:id/like', 
    validate(likePostSchema), 
    postController.unlikePost.bind(postController)
);

// Unlike post
postRouter.delete('/:id/like', 
    validate(likePostSchema), 
    postController.unlikePost.bind(postController)
);
