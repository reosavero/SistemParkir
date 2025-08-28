const express = require("express");
const router = express.Router();
const Tarif = require("../models/Model_Tarif");

// middleware cek login
function isAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/login");
  next();
}

// middleware cek super admin
function isSuperAdmin(req, res, next) {
  if (req.session.user.role.toLowerCase() !== "super admin") {
    return res.status(403).send("Akses khusus Super Admin");
  }
  next();
}

// Halaman daftar tarif
router.get("/", isAuth, isSuperAdmin, async (req, res) => {
  try {
    const data = await Tarif.getAll();
    res.render("tarif/index", { user: req.session.user, data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan");
  }
});

// Form tambah tarif
router.get("/create", isAuth, isSuperAdmin, (req, res) => {
  res.render("tarif/create", { error: null });
});

// Proses tambah tarif
router.post("/create", isAuth, isSuperAdmin, async (req, res) => {
  try {
    const { harga, waktu, type } = req.body;
    await Tarif.store({ harga, waktu, type });
    res.redirect("/tarif");
  } catch (err) {
    console.error(err);
    res.render("tarif/create", { error: "Gagal menambah tarif" });
  }
});

// Tampilkan form edit
router.get("/edit/:id", isAuth, isSuperAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const tarif = await Tarif.getById(id);
    if (!tarif) return res.status(404).send("Tarif tidak ditemukan");
    res.render("tarif/edit", { user: req.session.user, tarif, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan");
  }
});

// Proses update
router.post("/edit/:id", isAuth, isSuperAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { harga, waktu, type } = req.body;
    await Tarif.update(id, { harga, waktu, type });
    res.redirect("/tarif");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal mengupdate tarif");
  }
});

// Hapus tarif
router.get("/delete/:id", isAuth, isSuperAdmin, async (req, res) => {
  try {
    await Tarif.delete(req.params.id);
    res.redirect("/tarif");
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal menghapus tarif");
  }
});

module.exports = router;
