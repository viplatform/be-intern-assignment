import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { UserFollow } from '../entities/UserFollow';
import { PaginatedResponse, PaginationParams } from '../types/pagination';

export class FeedService {
    private postRepository = AppDataSource.getRepository(Post);
    private userRepository = AppDataSource.getRepository(User);
    private userFollowRepository = AppDataSource.getRepository(UserFollow);

    async getUserFeed(userId: number, { limit = 10, offset = 0 }: PaginationParams): Promise<PaginatedResponse<Post>> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }

        const [posts, total] = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.hashtags', 'hashtags')
            .leftJoinAndSelect('post.likes', 'likes')
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('follow.followingId')
                    .from(UserFollow, 'follow')
                    .where('follow.followerId = :userId')
                    .getQuery();
                return 'post.authorId IN ' + subQuery;
            })
            .setParameter('userId', userId)
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
