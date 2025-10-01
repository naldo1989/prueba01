const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function init() {
  try {
    // Crear tabla usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        dni VARCHAR(20) UNIQUE NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100) NOT NULL
      );
    `);

    // Crear tabla registros
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registros (
        id SERIAL PRIMARY KEY,
        id_usuario INT NOT NULL,
        escuela INT NOT NULL,
        mesa INT NOT NULL,
        cantidad INT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `);

    // Usuario inicial (ejemplo DNI: 12345678 → pass: "678")
    await pool.query(`
      INSERT INTO usuarios (dni, nombre, apellido, email, password)
      VALUES ('12345678', 'Usuario', 'Inicial', 'inicial@test.com', '678')
      ON CONFLICT (dni) DO NOTHING;
    `);

    console.log("✅ Tablas creadas y usuario inicial cargado.");
  } catch (err) {
    console.error("❌ Error ejecutando init.js:", err);
  } finally {
    pool.end();
  }
}

init();
