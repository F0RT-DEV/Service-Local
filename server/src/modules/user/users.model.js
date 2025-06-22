import db from "../../db.js";
import {v4 as uuidv4} from "uuid";

export function getAllProviders() {
    return db("users")
        .where({})
        .select(
            "id",
            "name",
            "email",
            "phone",
            "role",
            "cep",
            "cpf",
            "logradouro",
            "complemento",
            "bairro",
            "localidade",
            "uf",
            "numero",
            "avatar", // <-- Adicionado aqui
            "created_at"
        );
}

export function getById(id) {
    return db("users")
        .where({id})
        .select(
            "id",
            "name",
            "email",
            "phone",
            "role",
            "cpf",
            "cep",
            "logradouro",
            "complemento",
            "bairro",
            "localidade",
            "uf",
            "numero",
            "avatar", // <-- Adicionado aqui
            "created_at"
        )
        .first();
}

export function getByEmail(email) {
    return db("users").where({email}).first();
}

export function create(user) {
    const id = uuidv4();
    return db("users").insert({id, ...user});
}

export function update(id, data) {
     return db("users").where({ id }).update(data);
}

export function remove(id) {
    return db("users").where({id}).del();
}

export function updatePassword(userId, password_hash) {
    return db("users").where({id: userId}).update({password_hash});
}