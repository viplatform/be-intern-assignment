import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { PostLike } from '../entities/PostLike';
import { Hashtag } from '../entities/Hashtag';
import { PaginatedResponse, PaginationParams } from '../types/pagination';

export class PostService {
    private postRepository = AppDataSource.getRepository(Post);
    private userRepository = AppDataSource.getRepository(User);
    private postLikeRepository = AppDataSource.getRepository(PostLike);
    private hashtagRepository = AppDataSource.getRepository(Hashtag);

    async createPost(authorId: number, content: string, hashtags: string[] = []): Promise<Post> {
        const author = await this.userRepository.findOneBy({ id: authorId });
        if (!author) {
            throw new Error('Author not found');
        }

        const hashtagEntities = await Promise.all(
            hashtags.map(async (tag) => {
                const normalizedTag = tag.toLowerCase().replace(/^#/, '');
                let hashtag = await this.hashtagRepository.findOneBy({ name: normalizedTag });
                if (!hashtag) {
                    hashtag = this.hashtagRepository.create({ name: normalizedTag });
                    await this.hashtagRepository.save(hashtag);
                }
                return hashtag;
            })
        );

        const post = this.postRepository.create({
            content,
            author,
            hashtags: hashtagEntities
        });

        return this.postRepository.save(post);
    }

    async getPost(postId: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['author', 'hashtags', 'likes']
        });
        if (!post) {
            throw new Error('Post not found');
        }
        return post;
    }

    async getPosts({ limit = 10, offset = 0 }: PaginationParams): Promise<PaginatedResponse<Post>> {
        const [posts, total] = await this.postRepository.findAndCount({
            relations: ['author', 'hashtags', 'likes'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset
        });

        return {
            items: posts,
            total
        };
    }

    async updatePost(postId: number, content: string): Promise<Post> {
        const post = await this.getPost(postId);
        post.content = content;
        return this.postRepository.save(post);
    }

    async deletePost(postId: number): Promise<void> {
        const result = await this.postRepository.delete(postId);
        if (result.affected === 0) {
            throw new Error('Post not found');
        }
    }

    async likePost(userId: number, postId: number): Promise<PostLike> {
        const [user, post] = await Promise.all([
            this.userRepository.findOneBy({ id: userId }),
            this.getPost(postId)
        ]);

        if (!user) {
            throw new Error('User not found');
        }

        const existingLike = await this.postLikeRepository.findOneBy({
            user: { id: userId },
            post: { id: postId }
        });

        if (existingLike) {
            throw new Error('Post already liked');
        }

        const like = this.postLikeRepository.create({ user, post });
        return this.postLikeRepository.save(like);
    }

    async unlikePost(userId: number, postId: number): Promise<void> {
        const result = await this.postLikeRepository.delete({
            user: { id: userId },
            post: { id: postId }
        });

        if (result.affected === 0) {
            throw new Error('Like not found');
        }
    }
}