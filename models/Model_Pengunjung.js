const db = require('../db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT p.*, k.nopolisi FROM \`Pengunjung\` p
       LEFT JOIN \`Kendaraan\` k ON p.id_kendaraan = k.id_kendaraan`
    );
    return rows;
  },

  store: async ({ wajah, pakaian, jenis_kelamin, id_kendaraan = null }) => {
    const [r] = await db.query(
      'INSERT INTO `Pengunjung` (wajah,pakaian,jenis_kelamin,id_kendaraan) VALUES (?,?,?,?)',
      [wajah, pakaian, jenis_kelamin, id_kendaraan]
    );
    return r.insertId;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM `Pengunjung` WHERE id_pengunjung = ?', [id]);
    return rows[0];
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    for (const key of ['wajah','pakaian','jenis_kelamin','id_kendaraan']) {
      if (data[key] !== undefined) { fields.push(`${key}=?`); values.push(data[key]); }
    }
    if (fields.length === 0) return;
    values.push(id);
    const sql = `UPDATE \`Pengunjung\` SET ${fields.join(',')} WHERE id_pengunjung = ?`;
    return db.query(sql, values);
  },

  delete: async (id) => {
    return db.query('DELETE FROM `Pengunjung` WHERE id_pengunjung = ?', [id]);
  }
};
