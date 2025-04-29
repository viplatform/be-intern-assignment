import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { Hashtag } from '../entities/Hashtag';
import { PaginatedResponse, PaginationParams } from '../types/pagination';

export class HashtagService {
    private postRepository = AppDataSource.getRepository(Post);
    private hashtagRepository = AppDataSource.getRepository(Hashtag);

    async getPostsByHashtag(tag: string, { limit = 10, offset = 0 }: PaginationParams): Promise<PaginatedResponse<Post>> {
        if (!tag) {
            throw new Error('Hashtag is required');
        }

        const normalizedTag = tag.toLowerCase().replace(/^#/, '');

        const [posts, total] = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.hashtags', 'hashtags')
            .leftJoinAndSelect('post.likes', 'likes')
            .where('LOWER(hashtags.name) = LOWER(:tag)', { tag: normalizedTag })
            .orderBy('post.createdAt', 'DESC')
            .take(limit)
            .skip(offset)
            .getManyAndCount();

        return {
            items: posts,
            total
        };
    }
}