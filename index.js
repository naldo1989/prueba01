//index.js
const express = require("express");
const app = express();

// Railway te asigna el puerto, no pongas fijo el 3000
const PORT = process.env.PORT || 3000;

// Si querés servir HTML estático desde /public
app.use(express.static("public"));

app.get("/api", (req, res) => {
  res.json({ mensaje: "Hola desde NANDO Railway API ??" });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
