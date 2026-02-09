import { Request, Response } from 'express';
import { Hashtag } from '../entities/Hashtag';
import { AppDataSource } from '../data-source';

export class HashtagController {
  private hashtagRepository = AppDataSource.getRepository(Hashtag);

  async getAllHashtags(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const [hashtags, total] = await this.hashtagRepository.findAndCount({
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      res.json({
        data: hashtags,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching hashtags', error });
    }
  }

  async getHashtagById(req: Request, res: Response) {
    try {
      const hashtag = await this.hashtagRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['posts'],
      });

      if (!hashtag) {
        return res.status(404).json({ message: 'Hashtag not found' });
      }

      res.json({
        ...hashtag,
        postCount: hashtag.posts?.length || 0,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching hashtag', error });
    }
  }

  async createHashtag(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const normalizedName = name.toLowerCase().trim();

      const existingHashtag = await this.hashtagRepository.findOneBy({ name: normalizedName });
      if (existingHashtag) {
        return res.status(409).json({ message: 'Hashtag already exists', hashtag: existingHashtag });
      }

      const hashtag = this.hashtagRepository.create({ name: normalizedName });
      const result = await this.hashtagRepository.save(hashtag);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating hashtag', error });
    }
  }

  async updateHashtag(req: Request, res: Response) {
    try {
      const hashtagId = parseInt(req.params.id);
      const { name } = req.body;

      const hashtag = await this.hashtagRepository.findOneBy({ id: hashtagId });
      if (!hashtag) {
        return res.status(404).json({ message: 'Hashtag not found' });
      }

      if (name) {
        const normalizedName = name.toLowerCase().trim();

        const existingHashtag = await this.hashtagRepository.findOneBy({ name: normalizedName });
        if (existingHashtag && existingHashtag.id !== hashtagId) {
          return res.status(409).json({ message: 'Hashtag with this name already exists' });
        }

        hashtag.name = normalizedName;
      }

      const result = await this.hashtagRepository.save(hashtag);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating hashtag', error });
    }
  }

  async deleteHashtag(req: Request, res: Response) {
    try {
      const result = await this.hashtagRepository.delete(parseInt(req.params.id));
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Hashtag not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting hashtag', error });
    }
  }
}
