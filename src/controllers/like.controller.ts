import { Request, Response } from 'express';
import { Like } from '../entities/Like';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { AppDataSource } from '../data-source';

export class LikeController {
  private likeRepository = AppDataSource.getRepository(Like);
  private userRepository = AppDataSource.getRepository(User);
  private postRepository = AppDataSource.getRepository(Post);

  async getAllLikes(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const [likes, total] = await this.likeRepository.findAndCount({
        relations: ['user', 'post'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      res.json({
        data: likes,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching likes', error });
    }
  }

  async getLikeById(req: Request, res: Response) {
    try {
      const like = await this.likeRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['user', 'post'],
      });

      if (!like) {
        return res.status(404).json({ message: 'Like not found' });
      }

      res.json(like);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching like', error });
    }
  }

  async getLikesForPost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const [likes, total] = await this.likeRepository.findAndCount({
        where: { postId },
        relations: ['user'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      res.json({
        data: likes,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching likes for post', error });
    }
  }

  async createLike(req: Request, res: Response) {
    try {
      const { userId, postId } = req.body;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const post = await this.postRepository.findOneBy({ id: postId });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const existingLike = await this.likeRepository.findOne({
        where: { userId, postId },
      });

      if (existingLike) {
        return res.status(409).json({ message: 'User has already liked this post', like: existingLike });
      }

      const like = this.likeRepository.create({ userId, postId });
      const result = await this.likeRepository.save(like);

      const savedLike = await this.likeRepository.findOne({
        where: { id: result.id },
        relations: ['user', 'post'],
      });

      res.status(201).json(savedLike);
    } catch (error) {
      res.status(500).json({ message: 'Error creating like', error });
    }
  }

  async deleteLike(req: Request, res: Response) {
    try {
      const result = await this.likeRepository.delete(parseInt(req.params.id));
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Like not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting like', error });
    }
  }

  async unlikePost(req: Request, res: Response) {
    try {
      const { userId, postId } = req.body;

      const result = await this.likeRepository.delete({ userId, postId });
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Like not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error removing like', error });
    }
  }
}
