import express from 'express';
import {
    criarUsuarioController,
    listarUsuariosController,
    loginController,
    buscarUsuarioController
} from '../controllers/UserController.js';

const router = express.Router();

// Rotas de usuário
router.post('/usuarios', criarUsuarioController);
router.get('/usuarios', listarUsuariosController);
router.get('/usuarios/:id', buscarUsuarioController);

// Rota de autenticação
router.post('/login', loginController);

export default router;