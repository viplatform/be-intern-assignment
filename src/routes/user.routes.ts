import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middleware/validation.middleware';
import { createUserSchema, userQuerySchema } from '../validations/user.validation';

const router = Router();
const userController = new UserController();

// Note: We're using the methods directly, not as function factories
router.post('/', 
    validate(createUserSchema), 
    (req, res) => userController.createUser(req, res)
);

router.get('/', 
    validate(userQuerySchema), 
    (req, res) => userController.getAllUsers(req, res)
);

export { router as userRouter };
