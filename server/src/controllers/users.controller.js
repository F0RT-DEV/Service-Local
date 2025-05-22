import * as User from '../models/users.model.js';

export async function index(req, res) {
  const users = await User.getAll();
  res.json(users);
}

export async function show(req, res) {
  const user = await User.getById(req.params.id);
  res.json(user);
}

export async function store(req, res) {
  const id = await User.create(req.body);
  res.status(201).json({ id: id[0] });
}
