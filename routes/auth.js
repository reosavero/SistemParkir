const express = require("express");
const router = express.Router();
const Users = require("../models/Model_Users");

// GET register
router.get("/register", (req, res) => {
  res.render("auth/register", { error: null });
});

// POST register
router.post("/register", async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    // cek email sudah ada?
    const existing = await Users.getAll();
    if (existing.find((u) => u.email === email)) {
      return res.render("auth/register", { error: "Email sudah terdaftar" });
    }
    await Users.store({ nama, email, password, role });
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.render("auth/register", { error: "Terjadi kesalahan" });
  }
});

// GET login
router.get("/login", (req, res) => {
  res.render("auth/login", { error: null });
});

// POST login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.login(email, password);
    if (!user)
      return res.render("auth/login", { error: "Email/password salah" });

    // simpan session
    req.session.user = {
      id: user.id_users,
      nama: user.nama,
      email: user.email,
      role: user.role,
    };

    if (user.role === "super admin") {
      return res.redirect("/dashboard");
    } else if (user.role === "admin") {
      return res.redirect("/kendaraan"); // halaman utama admin (kendaraan, parkir, dll)
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.render("auth/login", { error: "Terjadi kesalahan" });
  }
});

// GET logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/auth/login"));
});

module.exports = router;
