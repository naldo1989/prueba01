const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Ruta principal con el formulario
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Registro de usuario
app.post("/register", async (req, res) => {
  const { nombre, password } = req.body;
  try {
    await pool.query("INSERT INTO usuarios (nombre, password) VALUES ($1, $2)", [nombre, password]);
    res.send("✅ Usuario registrado correctamente");
  } catch (err) {
    console.error(err);
    res.send("❌ Error al registrar usuario");
  }
});

// Login
app.post("/login", async (req, res) => {
  const { nombre, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE nombre = $1 AND password = $2", [nombre, password]);
    if (result.rows.length > 0) {
      res.send("🎉 Login exitoso, bienvenido " + nombre);
    } else {
      res.send("❌ Usuario o contraseña incorrectos");
    }
  } catch (err) {
    console.error(err);
    res.send("❌ Error al hacer login");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
