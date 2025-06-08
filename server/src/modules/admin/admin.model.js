import db from "../../db.js";

export const ProviderModel = {
  
  async findById(id) {
    return await db('providers').where({ id }).first();
  },

  async updateStatus(id, status) {
    return await db('providers')
      .where({ id })
      .update({ status});
  },

  async findPending() {
    return await db('providers').where({ status: 'pending' });
  },

  async rejectedById(id) {
    return await db('providers')
      .where({ id })
      .update({ status: 'rejected'});
  },
  async findApproved() {
    return await db('providers').where({ status: 'approved' });
  },
  async findAllByPending() {
    return await db('providers').where({ status: 'pending' });
  },
  async getAllUsers() {
    return await db('users');
  
  }

};

export default ProviderModel;