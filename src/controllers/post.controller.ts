import { Request, Response } from 'express';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Hashtag } from '../entities/Hashtag';
import { AppDataSource } from '../data-source';

export class PostController {
  private postRepository = AppDataSource.getRepository(Post);
  private userRepository = AppDataSource.getRepository(User);
  private hashtagRepository = AppDataSource.getRepository(Hashtag);

  async getAllPosts(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const [posts, total] = await this.postRepository.findAndCount({
        relations: ['user', 'hashtags', 'likes'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      const postsWithLikeCount = posts.map((post) => ({
        ...post,
        likeCount: post.likes?.length || 0,
        likes: undefined,
      }));

      res.json({
        data: postsWithLikeCount,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['user', 'hashtags', 'likes'],
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json({
        ...post,
        likeCount: post.likes?.length || 0,
        likes: undefined,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post', error });
    }
  }

  async getPostsByHashtag(req: Request, res: Response) {
    try {
      const tag = req.params.tag.toLowerCase().trim();
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const hashtag = await this.hashtagRepository.findOne({
        where: { name: tag },
      });

      if (!hashtag) {
        return res.status(404).json({ message: 'Hashtag not found' });
      }

      const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .leftJoinAndSelect('post.likes', 'likes')
        .innerJoin('post.hashtags', 'ht', 'ht.id = :hashtagId', { hashtagId: hashtag.id })
        .orderBy('post.createdAt', 'DESC');

      const total = await queryBuilder.getCount();

      const posts = await queryBuilder.skip(offset).take(limit).getMany();

      const formattedPosts = posts.map((post) => ({
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
        hashtag: tag,
        data: formattedPosts,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts by hashtag', error });
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const { content, userId, hashtags } = req.body;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const post = this.postRepository.create({
        content,
        userId,
      });

      if (hashtags && hashtags.length > 0) {
        const hashtagEntities: Hashtag[] = [];

        for (const tagName of hashtags) {
          const normalizedName = tagName.toLowerCase().trim();
          let hashtag = await this.hashtagRepository.findOneBy({ name: normalizedName });

          if (!hashtag) {
            hashtag = this.hashtagRepository.create({ name: normalizedName });
            await this.hashtagRepository.save(hashtag);
          }
          hashtagEntities.push(hashtag);
        }

        post.hashtags = hashtagEntities;
      }

      const result = await this.postRepository.save(post);

      const savedPost = await this.postRepository.findOne({
        where: { id: result.id },
        relations: ['user', 'hashtags'],
      });

      res.status(201).json(savedPost);
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error });
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const { content, hashtags } = req.body;

      const post = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['hashtags'],
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (content) {
        post.content = content;
      }

      if (hashtags !== undefined) {
        const hashtagEntities: Hashtag[] = [];

        for (const tagName of hashtags) {
          const normalizedName = tagName.toLowerCase().trim();
          let hashtag = await this.hashtagRepository.findOneBy({ name: normalizedName });

          if (!hashtag) {
            hashtag = this.hashtagRepository.create({ name: normalizedName });
            await this.hashtagRepository.save(hashtag);
          }
          hashtagEntities.push(hashtag);
        }

        post.hashtags = hashtagEntities;
      }

      const result = await this.postRepository.save(post);

      const updatedPost = await this.postRepository.findOne({
        where: { id: result.id },
        relations: ['user', 'hashtags'],
      });

      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: 'Error updating post', error });
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const result = await this.postRepository.delete(parseInt(req.params.id));
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting post', error });
    }
  }
}
