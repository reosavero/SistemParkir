const express = require("express");
const router = express.Router();
const Kendaraan = require("../models/Model_Kendaraan");
const Users = require("../models/Model_Users");
const Tarif = require("../models/Model_Tarif");
const Pengunjung = require("../models/Model_Pengunjung"); // pastikan file ini ada

function isAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/login");
  next();
}

function isSuperAdmin(req, res, next) {
  if (req.session.user.role.toLowerCase() !== "super admin") {
    return res.status(403).send("Akses khusus Super Admin");
  }
  next();
}

router.get("/", isAuth, isSuperAdmin, async (req, res) => {
  try {
    const totalKendaraan = (await Kendaraan.getAll()).length;
    const totalUsers = (await Users.getAll()).length;
    const totalTarif = (await Tarif.getAll()).length;
    const totalPengunjung = (await Pengunjung.getAll()).length; // ✅ ambil data pengunjung

    res.render("dashboard/index", {
      user: req.session.user,
      totalKendaraan,
      totalUsers,
      totalTarif,
      totalPengunjung, // ✅ jangan lupa dikirim ke ejs
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan di server");
  }
});

module.exports = router;
