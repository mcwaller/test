const express = require("express");
const cors = require("cors");
const conectarDB = require("./conexion");

const app = express();
const port = 3011;

// Middleware
app.use(cors());
app.use(express.json()); // Esto te permite recibir y enviar JSON

// Conectar a la base de datos
conectarDB();

// Aquí puedes agregar tus rutas, por ejemplo:
// app.use('/api/tusRutas', require('./rutaEspecifica'));
const rutausuario = require("./rutas/usuario");
const loginusuario = require("./rutas/usuario");
const deparments = require("./rutas/departamentos");
const alert = require("./rutas/alert");

//importar body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "true" }));

app.use("/api/usuario", rutausuario);
app.use("/api/users", loginusuario);
app.use("/api/verifyToken", rutausuario);
app.use("/api//logout", rutausuario);
app.use("/api/depart", deparments);
app.use("/api/alert", alert);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
