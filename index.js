const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const pool = require("./db");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));

app.use(session({
  secret: "mi-secreto-ultra",   // ⚠️ cámbialo por algo más fuerte en producción
  resave: false,
  saveUninitialized: true
}));

// === Vistas ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// === Acciones ===
app.post("/register", async (req, res) => {
  const { nombre, password } = req.body;
  try {
    await pool.query("INSERT INTO usuarios (nombre, password) VALUES ($1, $2)", [nombre, password]);
    req.session.user = { nombre };
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.send(`
      <div class="container">
        <p>❌ Error al registrar usuario</p>
        <a href="/register">Volver a registro</a>
      </div>
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
      req.session.user = { nombre };
      res.redirect("/dashboard");
    } else {
      res.send(`
        <div class="container">
          <p>❌ Usuario o contraseña incorrectos</p>
          <a href="/">Volver al login</a>
        </div>
      `);
    }
  } catch (err) {
    console.error(err);
    res.send("❌ Error al hacer login");
  }
});

app.post("/setData", (req, res) => {
  if (!req.session.user) return res.redirect("/");
  const { escuela, mesa } = req.body;
  req.session.user.escuela = escuela;
  req.session.user.mesa = mesa;
  res.send(`
    <div class="container">
      <h1>✅ Datos guardados</h1>
      <p>Escuela: ${escuela}</p>
      <p>Mesa: ${mesa}</p>
      <a href="/dashboard">Volver al panel</a>
    </div>
  `);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
