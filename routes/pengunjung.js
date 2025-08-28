const express = require('express');
const router = express.Router();
const Pengunjung = require('../models/Model_Pengunjung');

// Middleware cek login (opsional, kalau pengunjung harus login dulu)
function isAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
}

router.use(isAuth);

// 📌 List semua pengunjung
router.get('/', async (req, res) => {
  try {
    const pengunjung = await Pengunjung.getAll();
    res.render('pengunjung/index', { pengunjung });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error mengambil data pengunjung');
  }
});

// 📌 Form tambah pengunjung
router.get('/add', (req, res) => {
  res.render('pengunjung/add');
});

// 📌 Simpan data pengunjung baru
router.post('/add', async (req, res) => {
  try {
    const { wajah, pakaian, jenis_kelamin, id_kendaraan } = req.body;
    await Pengunjung.store({ wajah, pakaian, jenis_kelamin, id_kendaraan });
    res.redirect('/pengunjung');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menambahkan pengunjung');
  }
});

// 📌 Form edit pengunjung
router.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pengunjung = await Pengunjung.getById(id);
    if (!pengunjung) return res.redirect('/pengunjung');
    res.render('pengunjung/edit', { pengunjung });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error menampilkan form edit');
  }
});

// 📌 Update data pengunjung
router.post('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { wajah, pakaian, jenis_kelamin, id_kendaraan } = req.body;
    await Pengunjung.update(id, { wajah, pakaian, jenis_kelamin, id_kendaraan });
    res.redirect('/pengunjung');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal update data pengunjung');
  }
});

// 📌 Hapus pengunjung
router.post('/delete/:id', async (req, res) => {
  try {
    await Pengunjung.delete(req.params.id);
    res.redirect('/pengunjung');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menghapus pengunjung');
  }
});

module.exports = router;
