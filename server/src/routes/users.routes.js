import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.js';

const router = Router();

router.post('/users', UsersController.createUser);
router.get('/users', UsersController.getUsers);
router.get('/users/:id', UsersController.getUserById);

router.post('/auth/register', UsersController.createUser);
// router.post('/auth/register', UsersController.createUser);
// router.get('/me', UsersController.createUser);
// router.patch('/users/:id/status', UsersController.createUser);
// router.get('/users/:id', UsersController.createUser);
// router.get('/users?role=prestador', UsersController.createUser);
export default router;
