const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const pool = require('./db'); 
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "mi_secreto",
  resave: false,
  saveUninitialized: true
}));

// Rutas
app.get("/", (req, res) => res.redirect("/login"));

// Login
app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
  const { dni, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE dni=$1", [dni]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (user.password === password) {
        req.session.user = user;
        return res.redirect("/dashboard");
      }
    }
    res.send("DNI o contraseña incorrectos");
  } catch (err) {
    console.error("Error en login:", err);
    res.send("Error en login");
  }
});

app.post('/register', async (req, res) => {
  const { dni, nombre, apellido } = req.body;
  const password = dni.slice(-3); // últimos 3 dígitos

  try {
    await pool.query(
      'INSERT INTO usuarios (dni, nombre, apellido, password) VALUES ($1, $2, $3, $4)',
      [dni, nombre, apellido, password]
    );
    res.redirect('/login');
  } catch (err) {
    console.error("Error registrando usuario:", err);
    res.status(500).send("Error registrando usuario");
  }
});

// Dashboard
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
});

app.post("/setMesa", (req, res) => {
  const { escuela, mesa } = req.body;
  req.session.user.escuela = escuela;
  req.session.user.mesa = mesa;
  res.redirect("/dashboard");
});

// Registros
app.get("/registros", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  try {
    const result = await pool.query(
      "SELECT * FROM registros WHERE id_usuario=$1 ORDER BY fecha DESC",
      [req.session.user.id]
    );
    res.render("registros", { user: req.session.user, registros: result.rows });
  } catch (err) {
    console.error("Error recuperando registros:", err);
    res.render("registros", { user: req.session.user, registros: [] });
  }
});

app.post("/registros", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const { cantidad } = req.body;
  const { id, escuela, mesa } = req.session.user;
  try {
    await pool.query(
      "INSERT INTO registros (id_usuario, escuela, mesa, cantidad) VALUES ($1, $2, $3, $4)",
      [id, escuela, mesa, cantidad]
    );
    res.redirect("/registros");
  } catch (err) {
    console.error("Error guardando registro:", err);
    res.send("Error al guardar registro");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
