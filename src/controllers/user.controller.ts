import { Request, Response } from 'express';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Like } from '../entities/Like';
import { Follow } from '../entities/Follow';
import { AppDataSource } from '../data-source';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private postRepository = AppDataSource.getRepository(Post);
  private likeRepository = AppDataSource.getRepository(Like);
  private followRepository = AppDataSource.getRepository(Follow);

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = this.userRepository.create(req.body);
      const result = await this.userRepository.save(user);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      this.userRepository.merge(user, req.body);
      const result = await this.userRepository.save(user);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await this.userRepository.delete(parseInt(req.params.id));
      if (result.affected === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }

  async getFollowers(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const [follows, total] = await this.followRepository.findAndCount({
        where: { followingId: userId },
        relations: ['follower'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      const followers = follows.map((f) => ({
        id: f.follower.id,
        firstName: f.follower.firstName,
        lastName: f.follower.lastName,
        email: f.follower.email,
        followedAt: f.createdAt,
      }));

      res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        followerCount: total,
        data: followers,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching followers', error });
    }
  }

  async getActivity(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const type = req.query.type as string | undefined;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const dateFilter = this.buildDateFilter(startDate, endDate);

      const activities: Array<{
        type: 'post' | 'like' | 'follow';
        data: any;
        createdAt: Date;
      }> = [];

      if (!type || type === 'post') {
        const posts = await this.postRepository.find({
          where: {
            userId,
            ...(dateFilter && { createdAt: dateFilter }),
          },
          relations: ['hashtags'],
          order: { createdAt: 'DESC' },
        });

        posts.forEach((post) => {
          activities.push({
            type: 'post',
            data: {
              id: post.id,
              content: post.content,
              hashtags: post.hashtags?.map((h) => h.name) || [],
            },
            createdAt: post.createdAt,
          });
        });
      }

      if (!type || type === 'like') {
        const likes = await this.likeRepository.find({
          where: {
            userId,
            ...(dateFilter && { createdAt: dateFilter }),
          },
          relations: ['post', 'post.user'],
          order: { createdAt: 'DESC' },
        });

        likes.forEach((like) => {
          activities.push({
            type: 'like',
            data: {
              id: like.id,
              post: {
                id: like.post.id,
                content: like.post.content,
                author: {
                  id: like.post.user.id,
                  firstName: like.post.user.firstName,
                  lastName: like.post.user.lastName,
                },
              },
            },
            createdAt: like.createdAt,
          });
        });
      }

      if (!type || type === 'follow') {
        const follows = await this.followRepository.find({
          where: {
            followerId: userId,
            ...(dateFilter && { createdAt: dateFilter }),
          },
          relations: ['following'],
          order: { createdAt: 'DESC' },
        });

        follows.forEach((follow) => {
          activities.push({
            type: 'follow',
            data: {
              id: follow.id,
              following: {
                id: follow.following.id,
                firstName: follow.following.firstName,
                lastName: follow.following.lastName,
                email: follow.following.email,
              },
            },
            createdAt: follow.createdAt,
          });
        });
      }

      activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const total = activities.length;
      const paginatedActivities = activities.slice(offset, offset + limit);

      res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        data: paginatedActivities,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
        filters: {
          type: type || 'all',
          startDate: startDate?.toISOString() || null,
          endDate: endDate?.toISOString() || null,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user activity', error });
    }
  }

  private buildDateFilter(startDate?: Date, endDate?: Date) {
    if (startDate && endDate) {
      return Between(startDate, endDate);
    } else if (startDate) {
      return MoreThanOrEqual(startDate);
    } else if (endDate) {
      return LessThanOrEqual(endDate);
    }
    return undefined;
  }
}
