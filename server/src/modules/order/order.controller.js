import { v4 as uuidv4 } from "uuid";
import * as orderModel from "./order.model.js";
import { CreateOrderSchema, UpdateOrderSchema } from "./order.schema.js";

export async function createOrder(req, res) {
  try {
    const validated = CreateOrderSchema.parse(req.body);
    const id = uuidv4();
    const order = { ...validated, id, created_at: new Date() };
    await orderModel.create(order);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await orderModel.getAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar ordens" });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await orderModel.getById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const validated = UpdateOrderSchema.parse(req.body);
    const updated = await orderModel.update(id, validated);
    if (!updated || updated.length === 0) return res.status(404).json({ error: "Order not found" });
    res.json(updated[0]);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
}

export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const deleted = await orderModel.remove(id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}