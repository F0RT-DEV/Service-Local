import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.js';

const router = Router();


// Rotas do Angelo
router.post('/users', UsersController.createUser);
router.get('/users', UsersController.getUsers);
router.get('/users/:id', UsersController.getUserById);


router.post('/auth/register', UsersController.createUser);
// router.post('/auth/register', UsersController.createUser);

// router.patch('/users/:id/status', UsersController.createUser);





export default router;
