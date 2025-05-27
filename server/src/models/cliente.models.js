import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

export function getAllUsers() {
  return db("users");
}

export function getUserById(id) {
  return db("users").where({ id }).first();
}

export function createUser(user) {
  const id = uuidv4();
  return db("users").insert({ id, ...user });
}

export function updateUser(id, user) {
  return db("users").where({ id }).update(user);
}

export function deleteUser(id) {
  return db("users").where({ id }).del();
}
