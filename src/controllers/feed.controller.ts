import { Request, Response } from 'express';
import { Post } from '../entities/Post';
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { In } from 'typeorm';

export class FeedController {
  private postRepository = AppDataSource.getRepository(Post);
  private followRepository = AppDataSource.getRepository(Follow);
  private userRepository = AppDataSource.getRepository(User);

  async getFeed(req: Request, res: Response) {
    try {
      const userId = parseInt(req.query.userId as string);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const following = await this.followRepository.find({
        where: { followerId: userId },
        select: ['followingId'],
      });

      const followingIds = following.map((f) => f.followingId);

      if (followingIds.length === 0) {
        return res.json({
          data: [],
          pagination: {
            total: 0,
            limit,
            offset,
            hasMore: false,
          },
          message: 'You are not following anyone yet',
        });
      }

      const [posts, total] = await this.postRepository.findAndCount({
        where: { userId: In(followingIds) },
        relations: ['user', 'hashtags', 'likes'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      const feedPosts = posts.map((post) => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.user.id,
          firstName: post.user.firstName,
          lastName: post.user.lastName,
          email: post.user.email,
        },
        hashtags: post.hashtags?.map((h) => h.name) || [],
        likeCount: post.likes?.length || 0,
      }));

      res.json({
        data: feedPosts,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feed', error });
    }
  }
}
