import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.js';

const router = Router();

router.get('/', UsersController.index);
router.get('/:id', UsersController.show);
router.post('/', UsersController.store);

export default router;
