const db = require('../db');
const bcrypt = require('bcrypt');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM `Users`');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM `Users` WHERE id_users = ?', [id]);
    return rows[0];
  },

  store: async ({ nama, email, password, role }) => {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO `Users` (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [nama, email, hash, role || 'admin']
    );
    return result.insertId;
  },

  login: async (email, password) => {
    const [rows] = await db.query('SELECT * FROM `Users` WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    delete user.password; // hapus field password sebelum return
    return user;
  },

  update: async (id, { nama, email, password, role }) => {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      return db.query(
        'UPDATE `Users` SET nama=?, email=?, password=?, role=? WHERE id_users=?',
        [nama, email, hash, role, id]
      );
    } else {
      return db.query(
        'UPDATE `Users` SET nama=?, email=?, role=? WHERE id_users=?',
        [nama, email, role, id]
      );
    }
  },

  delete: async (id) => {
    return db.query('DELETE FROM `Users` WHERE id_users = ?', [id]);
  }
};
