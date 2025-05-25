import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.js';

const router = Router();

// Rotas do Angelo
router.post('/users', UsersController.createUser);
router.get('/users', UsersController.getUsers);
router.get('/users/:id', UsersController.getUserById);

// Rotas do server
router.post('/auth/register', UsersController.createUser);
// router.get('/me', UsersController.createUser); // descomente e ajuste conforme o controller real
// router.patch('/users/:id/status', UsersController.createUser);
// router.get('/users?role=prestador', UsersController.createUser);

export default router;
