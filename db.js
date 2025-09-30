const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:CBVmjKccNsHjcVLkTcvgieIVtasufrnw@maglev.proxy.rlwy.net:49146/railway",
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
