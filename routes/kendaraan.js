const express = require('express');
const router = express.Router();
const Kendaraan = require('../models/Model_Kendaraan');
const Tarif = require('../models/Model_tarif');
const multer = require('multer');
const path = require('path');

// Konfigurasi upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname,'..','public','uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware auth
function isAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
}

// GET list kendaraan
router.get('/', isAuth, async (req, res) => {
  try {
    const list = await Kendaraan.getAll();
    const tariffs = await Tarif.getAll();
    res.render('kendaraan/index', { kendaraan: list, tariffs });
  } catch (err) {
    console.error('Error GET /kendaraan:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// POST add kendaraan
router.post('/add', isAuth, upload.single('foto'), async (req, res) => {
  try {
    // ⚠️ sesuaikan dengan kolom di DB: id_users
    const { id_users = null, id_tarif, nopolisi, type, warna } = req.body;
    const jam_masuk = new Date().toTimeString().split(' ')[0]; // HH:MM:SS
    const tanggal = new Date().toISOString().split('T')[0];
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    await Kendaraan.store({ id_users, id_tarif, nopolisi, type, foto, warna, jam_masuk, tanggal });
    res.redirect('/kendaraan');
  } catch (err) {
    console.error('Error POST /kendaraan/add:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// POST exit: set jam_keluar
router.post('/exit/:id', isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const kendaraan = await Kendaraan.getById(id);
    if (!kendaraan) return res.redirect('/kendaraan');

    const jam_keluar = new Date().toTimeString().split(' ')[0];
    await Kendaraan.updateExit(id, { jam_keluar, status: 'belum' });
    res.redirect(`/kendaraan/bayar/${id}`);
  } catch (err) {
    console.error('Error POST /kendaraan/exit:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// GET bayar => hitung tarif
router.get('/bayar/:id', isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const k = await Kendaraan.getById(id);
    if (!k) return res.redirect('/kendaraan');

    const today = k.tanggal ? k.tanggal : new Date().toISOString().split('T')[0];
    const masuk = new Date(`${today}T${k.jam_masuk}`);
    const keluar = k.jam_keluar ? new Date(`${today}T${k.jam_keluar}`) : new Date();

    let diffMs = keluar - masuk;
    if (diffMs < 0) diffMs += 24 * 3600 * 1000; // crossing midnight
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    const harga_per_unit = parseFloat(k.harga || 0);
    const total = hours * harga_per_unit;

    res.render('kendaraan/bayar', { k, hours, total });
  } catch (err) {
    console.error('Error GET /kendaraan/bayar:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// POST konfirmasi bayar
router.post('/bayar/:id', isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await Kendaraan.updateExit(id, { jam_keluar: (new Date().toTimeString().split(' ')[0]), status: 'sudah bayar' });
    res.redirect('/kendaraan');
  } catch (err) {
    console.error('Error POST /kendaraan/bayar:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
