const pool = require("./db"); // tu conexi�n pg
const fs = require("fs");

(async () => {
  try {
    const sql = fs.readFileSync("init.sql").toString();
    await pool.query(sql);
    console.log("Tablas creadas ?");
    process.exit(0);
  } catch (err) {
    console.error("Error al ejecutar script:", err);
    process.exit(1);
  }
})();
