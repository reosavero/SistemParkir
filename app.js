require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MemoryStore = require('session-memory-store')(session);
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'partials/layout');

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod: 86400000 }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const tarifRouter = require('./routes/tarif');
const kendaraanRouter = require('./routes/kendaraan');
const pengunjungRouter = require('./routes/pengunjung');
const dashboardRoutes = require("./routes/dashboard");
const dashboardAdminRoutes = require("./routes/dashboardadmin");


app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/tarif', tarifRouter);
app.use('/kendaraan', kendaraanRouter);
app.use('/pengunjung', pengunjungRouter);
app.use('/dashboard', dashboardRoutes);
app.use("/dashboardadmin", dashboardAdminRoutes);


app.get('/', (req, res) => res.redirect('/kendaraan'));

app.listen(port, () => console.log(`Server started http://localhost:${port}`));
