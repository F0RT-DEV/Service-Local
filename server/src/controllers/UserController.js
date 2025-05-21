import {
    criarUsuario,
    listarUsuarios,
    buscarUsuarioPorEmail,
    buscarUsuarioPorId
} from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import bcrypt from 'bcrypt';

export const criarUsuarioController = async (req, res) => {
    const { nome, email, senha, telefone, tipo } = req.body;

    if (!nome || !email || !senha || !telefone || !tipo) {
        return res.status(400).json({ 
            success: false,
            message: 'Todos os campos são obrigatórios' 
        });
    }

    try {
        const [status, resposta] = await criarUsuario(nome, email, senha, telefone, tipo);
        
        if (status !== 201) {
            return res.status(status).json({
                success: false,
                message: resposta.mensagem || 'Erro ao criar usuário'
            });
        }
        
        return res.status(status).json({
            success: true,
            message: resposta.mensagem,
            userId: resposta.id
        });
    } catch (error) {
        console.error("Erro detalhado:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao criar usuário",
            error: error.message
        });
    }
};

export const listarUsuariosController = async (req, res) => {
    try {
        const [status, resposta] = await listarUsuarios();
        
        if (status !== 200) {
            return res.status(status).json({
                success: false,
                message: 'Erro ao listar usuários'
            });
        }
        
        return res.status(status).json({
            success: true,
            usuarios: resposta
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao listar usuários",
            error: error.message
        });
    }
};

export const loginController = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ 
            success: false,
            message: 'Email e senha são obrigatórios' 
        });
    }

    try {
        const [status, usuario] = await buscarUsuarioPorEmail(email);
        
        if (status !== 200 || !usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        const token = jwt.sign(
            { 
                id: usuario.id,
                email: usuario.email,
                tipo: usuario.tipo
            },
            process.env.JWT_SECRET || 'segredo_default',
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                tipo: usuario.tipo
            }
        });

    } catch (error) {
        console.error('Erro detalhado no login:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno no servidor',
            error: error.message
        });
    }
};

export const buscarUsuarioController = async (req, res) => {
    const { id } = req.params;

    try {
        const [status, usuario] = await buscarUsuarioPorId(id);
        
        if (status !== 200 || !usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        return res.status(status).json({
            success: true,
            usuario
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar usuário",
            error: error.message
        });
    }
};