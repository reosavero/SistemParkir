require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sistemparkir",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: "3307",
});

module.exports = pool;
