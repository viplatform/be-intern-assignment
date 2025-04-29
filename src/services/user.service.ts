import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { UserFollow } from '../entities/UserFollow';
import { PaginationParams } from '../types/pagination';
import { PaginatedResponse } from '../types/response';
import { ActivityType } from '../types/activity';

export class UserService {
    private userRepository: Repository<User>;
    private userFollowRepository: Repository<UserFollow>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.userFollowRepository = AppDataSource.getRepository(UserFollow);
    }

    async getAllUsers({ limit, offset }: PaginationParams): Promise<[User[], number]> {
        return await this.userRepository.findAndCount({
            skip: offset,
            take: limit,
        });
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({ id });
    }

    async createUser(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        await this.userRepository.update(id, userData);
        const updatedUser = await this.getUserById(id);
        if (!updatedUser) throw new Error('User not found');
        return updatedUser;
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async followUser(followerId: number, followingId: number): Promise<void> {
        const follow = this.userFollowRepository.create({
            follower: { id: followerId },
            following: { id: followingId }
        });
        await this.userFollowRepository.save(follow);
    }

    async unfollowUser(followerId: number, followingId: number): Promise<void> {
        await this.userFollowRepository.delete({
            follower: { id: followerId },
            following: { id: followingId }
        });
    }

    async getFollowers(userId: number, { limit, offset }: PaginationParams): Promise<[User[], number]> {
        const [followers, total] = await this.userFollowRepository.findAndCount({
            where: { following: { id: userId } },
            relations: ['follower'],
            skip: offset,
            take: limit
        });
        return [followers.map(f => f.follower), total];
    }

    async getUserActivity(
        userId: number,
        params: {
            type?: ActivityType;
            fromDate?: Date;
            toDate?: Date;
            limit: number;
            offset: number;
        }
    ): Promise<[any[], number]> {
        const { type, fromDate, toDate, limit, offset } = params;
        
        // Implementation depends on how you store activities
        // This is a placeholder that should be implemented based on your requirements
        return [[], 0];
    }
}
