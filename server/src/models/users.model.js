import db from '../db.js';

export function getAll() {
  return db('users');
}

export function getById(id) {
  return db('users').where({ id }).first();
}

export function create(user) {
  return db('users').insert(user);
}
