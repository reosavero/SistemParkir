const db = require("../db");

module.exports = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM `Tarif` ORDER BY id_tarif");
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM `Tarif` WHERE id_tarif = ?", [
      id,
    ]);
    return rows[0];
  },
  store: async ({ harga, waktu, type }) => {
    const [r] = await db.query(
      "INSERT INTO `Tarif` (harga, waktu, type) VALUES (?, ?, ?)",
      [harga, waktu, type]
    );
    return r.insertId;
  },
  update: async (id, { harga, waktu, type }) => {
    return db.query(
      "UPDATE `Tarif` SET harga=?, waktu=?, type=? WHERE id_tarif=?",
      [harga, waktu, type, id]
    );
  },
  delete: async (id) => {
    return db.query("DELETE FROM `Tarif` WHERE id_tarif=?", [id]);
  },
};
