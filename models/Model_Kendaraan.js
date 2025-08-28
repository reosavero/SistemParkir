const db = require('../db');

module.exports = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT k.*, u.nama AS pemilik, t.harga, t.waktu AS waktu_unit, t.type AS tarif_type
       FROM Kendaraan k
       LEFT JOIN Users u ON k.id_users = u.id_users
       LEFT JOIN Tarif t ON k.id_tarif = t.id_tarif
       ORDER BY k.tanggal DESC, k.jam_masuk DESC`
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT k.*, u.nama AS pemilik, t.harga, t.waktu AS waktu_unit, t.type AS tarif_type
       FROM Kendaraan k
       LEFT JOIN Users u ON k.id_users = u.id_users
       LEFT JOIN Tarif t ON k.id_tarif = t.id_tarif
       WHERE k.id_kendaraan = ?`, 
      [id]
    );
    return rows[0];
  },

  store: async ({ id_users = null, id_tarif, nopolisi, type, foto = null, warna, jam_masuk, tanggal }) => {
    const [r] = await db.query(
      `INSERT INTO Kendaraan (id_users,id_tarif,nopolisi,type,foto,warna,jam_masuk,tanggal,status)
       VALUES (?,?,?,?,?,?,?,?, 'belum')`,
      [id_users, id_tarif, nopolisi, type, foto, warna, jam_masuk, tanggal]
    );
    return r.insertId;
  },

  updateExit: async (id, { jam_keluar, status = 'sudah bayar' }) => {
    return db.query(
      'UPDATE Kendaraan SET jam_keluar = ?, status = ? WHERE id_kendaraan = ?', 
      [jam_keluar, status, id]
    );
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    for (const key of ['id_users','id_tarif','nopolisi','type','foto','warna','jam_masuk','jam_keluar','tanggal','status']) {
      if (data[key] !== undefined) { 
        fields.push(`${key}=?`); 
        values.push(data[key]); 
      }
    }
    if (fields.length === 0) return;
    values.push(id);
    const sql = `UPDATE Kendaraan SET ${fields.join(',')} WHERE id_kendaraan = ?`;
    return db.query(sql, values);
  },

  delete: async (id) => {
    return db.query('DELETE FROM Kendaraan WHERE id_kendaraan = ?', [id]);
  }
};
