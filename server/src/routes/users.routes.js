import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.js';

const router = Router();

router.post('/users', UsersController.createUser);
router.get('/users', UsersController.getUsers);
router.get('/users/:id', UsersController.getUserById);

export default router;
