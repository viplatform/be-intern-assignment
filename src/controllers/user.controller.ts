import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createApiResponse } from '../types/response';
import { ActivityType } from '../types/activity';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData = req.body;
            const user = await this.userService.createUser(userData);
            return res.status(201).json(createApiResponse(
                [user],
                10,
                0,
                1
            ));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create user';
            return res.status(400).json(createApiResponse(
                [],
                10,
                0,
                0,
                message,
                400
            ));
        }
    }

    public async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const limit = Number(req.query.limit) || 10;
            const offset = Number(req.query.offset) || 0;
            
            const [users, total] = await this.userService.getAllUsers({ limit, offset });
            
            return res.json(createApiResponse(
                users,
                limit,
                offset,
                total
            ));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch users';
            return res.status(500).json(createApiResponse(
                [],
                10,
                0,
                0,
                message,
                500
            ));
        }
    }
}
