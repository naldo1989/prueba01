const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// === Vistas ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

// === Acciones ===
app.post("/register", async (req, res) => {
  const { nombre, password } = req.body;
  try {
    await pool.query("INSERT INTO usuarios (nombre, password) VALUES ($1, $2)", [nombre, password]);
    res.send(`
      <p>✅ Usuario registrado correctamente</p>
      <a href="/">Volver al login</a>
    `);
  } catch (err) {
    console.error(err);
    res.send(`
      <p>❌ Error al registrar usuario</p>
      <a href="/register">Volver a registro</a>
    `);
  }
});

app.post("/login", async (req, res) => {
  const { nombre, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nombre = $1 AND password = $2",
      [nombre, password]
    );
    if (result.rows.length > 0) {
      res.send(`<h1>🎉 Bienvenido ${nombre}</h1><a href="/">Cerrar sesión</a>`);
    } else {
      res.send(`
        <p>❌ Usuario o contraseña incorrectos</p>
        <a href="/">Volver al login</a>
      `);
    }
  } catch (err) {
    console.error(err);
    res.send("❌ Error al hacer login");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
