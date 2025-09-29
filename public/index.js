const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde /public
app.use(express.static("public"));

// Ruta para manejar el POST del formulario
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // ⚠️ Lógica de prueba, no segura
  if (username === "admin" && password === "1234") {
    res.send(`<h2>Bienvenido, ${username} 🚀</h2>`);
  } else {
    res.send("<h2>Usuario o contraseña incorrectos ❌</h2>");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
