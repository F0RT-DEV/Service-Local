import db from '../db.js';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const conexao = mysql.createPool(db);

export const criarUsuario = async (nome, email, senha, telefone, tipo) => {
    console.log("UserModel :: criarUsuario");
    const senhaHash = await bcrypt.hash(senha, 10);

    const sql = `INSERT INTO usuarios (nome, email, senha, telefone, tipo) VALUES (?, ?, ?, ?, ?)`;
    const params = [nome, email, senhaHash, telefone, tipo];

    try {
        const [resposta] = await conexao.query(sql, params);
        return [201, { mensagem: 'Usuário criado com sucesso', id: resposta.insertId }];
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return [500, { mensagem: 'Erro ao criar usuário', erro: error.message }];
    }
}

export const listarUsuarios = async () => {
    console.log("UserModel :: listarUsuarios");
    const sql = `SELECT id, nome, email, telefone, tipo FROM usuarios`;
    
    try {
        const [resposta] = await conexao.query(sql);
        return [200, resposta];
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        return [500, { mensagem: 'Erro ao listar usuários', erro: error.message }];
    }
}

export const buscarUsuarioPorEmail = async (email) => {
    try {
        const [rows] = await conexao.query(
            `SELECT * FROM usuarios WHERE email = ?`,
            [email]
        );
        
        if (rows.length === 0) {
            return [404, null];
        }

        return [200, rows[0]];
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return [500, null];
    }
};

export const buscarUsuarioPorId = async (id) => {
    try {
        const [rows] = await conexao.query(
            `SELECT id, nome, email, telefone, tipo FROM usuarios WHERE id = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            return [404, null];
        }

        return [200, rows[0]];
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return [500, null];
    }
};  