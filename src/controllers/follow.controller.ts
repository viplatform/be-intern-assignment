import { Request, Response } from 'express';
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';

export class FollowController {
  private followRepository = AppDataSource.getRepository(Follow);
  private userRepository = AppDataSource.getRepository(User);

  async getAllFollows(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const [follows, total] = await this.followRepository.findAndCount({
        relations: ['follower', 'following'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      res.json({
        data: follows,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching follows', error });
    }
  }

  async getFollowById(req: Request, res: Response) {
    try {
      const follow = await this.followRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['follower', 'following'],
      });

      if (!follow) {
        return res.status(404).json({ message: 'Follow not found' });
      }

      res.json(follow);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching follow', error });
    }
  }

  async getFollowing(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const [follows, total] = await this.followRepository.findAndCount({
        where: { followerId: userId },
        relations: ['following'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      res.json({
        data: follows.map((f) => f.following),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching following list', error });
    }
  }

  async createFollow(req: Request, res: Response) {
    try {
      const { followerId, followingId } = req.body;

      if (followerId === followingId) {
        return res.status(400).json({ message: 'Users cannot follow themselves' });
      }

      const follower = await this.userRepository.findOneBy({ id: followerId });
      if (!follower) {
        return res.status(404).json({ message: 'Follower user not found' });
      }

      const following = await this.userRepository.findOneBy({ id: followingId });
      if (!following) {
        return res.status(404).json({ message: 'User to follow not found' });
      }

      const existingFollow = await this.followRepository.findOne({
        where: { followerId, followingId },
      });

      if (existingFollow) {
        return res.status(409).json({ message: 'Already following this user', follow: existingFollow });
      }

      const follow = this.followRepository.create({ followerId, followingId });
      const result = await this.followRepository.save(follow);

      const savedFollow = await this.followRepository.findOne({
        where: { id: result.id },
        relations: ['follower', 'following'],
      });

      res.status(201).json(savedFollow);
    } catch (error) {
      res.status(500).json({ message: 'Error creating follow', error });
    }
  }

  async deleteFollow(req: Request, res: Response) {
    try {
      const result = await this.followRepository.delete(parseInt(req.params.id));
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Follow not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting follow', error });
    }
  }

  async unfollow(req: Request, res: Response) {
    try {
      const { followerId, followingId } = req.body;

      const result = await this.followRepository.delete({ followerId, followingId });
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Follow relationship not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error unfollowing user', error });
    }
  }
}
