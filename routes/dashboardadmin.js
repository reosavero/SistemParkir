const express = require("express");
const router = express.Router();
const Kendaraan = require("../models/Model_Kendaraan");
const Pengunjung = require("../models/Model_Pengunjung");

function isAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/login");
  next();
}

// Cek role admin biasa
function isAdmin(req, res, next) {
  if (req.session.user.role.toLowerCase() !== "admin") {
    return res.status(403).send("Akses khusus Admin");
  }
  next();
}

// Dashboard Admin
router.get("/", isAuth, isAdmin, async (req, res) => {
  try {
    const totalKendaraan = (await Kendaraan.getAll()).length;
    const totalPengunjung = (await Pengunjung.getAll()).length;

    res.render("dashboardadmin/index", {
      user: req.session.user,
      totalKendaraan,
      totalPengunjung,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan di server");
  }
});

module.exports = router;
