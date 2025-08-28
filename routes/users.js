const express = require('express');
const router = express.Router();
const Users = require('../models/Model_Users');

function isAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
}

router.use(isAuth);

// halaman list user
router.get('/', async (req, res) => {
  const users = await Users.getAll();
  res.render('users/index', { users });
});

// halaman form edit user
router.get('/edit/:id', async (req, res) => {
  const user = await Users.getById(req.params.id);
  res.render('users/edit', { user });
});

// aksi update user
router.post('/edit/:id', async (req, res) => {
  await Users.update(req.params.id, req.body);
  res.redirect('/users');
});

// aksi hapus user
router.get('/delete/:id', async (req, res) => {
  await Users.delete(req.params.id);
  res.redirect('/users');
});

module.exports = router;
