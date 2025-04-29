import { Request, Response } from 'express';
import { PostService } from '../services/post.service';
import { createApiResponse } from '../types/response';

export class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    async getPosts(req: Request, res: Response) {
        try {
            const limit = Number(req.query.limit) || 10;
            const offset = Number(req.query.offset) || 0;

            const { items, total } = await this.postService.getPosts({ limit, offset });
            
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

    async unlikePost(req: Request, res: Response) {
        try {
            const postId = Number(req.params.id);
            const userId = Number(req.body.userId);
            
            await this.postService.unlikePost(userId, postId);
            res.status(204).send();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(400).json({ message });
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const postId = Number(req.params.id);
            await this.postService.deletePost(postId);
            res.status(204).send();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(400).json({ message });
        }
    }

    async updatePost(req: Request, res: Response) {
        try {
            const postId = Number(req.params.id);
            const content = req.body.content;
            
            const updatedPost = await this.postService.updatePost(postId, content);
            res.json(updatedPost);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(400).json({ message });
        }
    }

    async createPost(req: Request, res: Response) {
        try {
            const { authorId, content, hashtags } = req.body;
            const post = await this.postService.createPost(authorId, content, hashtags);
            res.status(201).json(post);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(400).json({ message });
        }
    }
}
