import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.js';

const router = Router();

router.post('/users', UsersController.createUser);

export default router;
