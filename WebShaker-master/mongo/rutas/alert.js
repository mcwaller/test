const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const router = express.Router();

// Si quieres aplicar CORS globalmente a todas las rutas, usa la línea siguiente:
// router.use(cors());

// Esquema para Departamentos
const limitSchema = new mongoose.Schema({}, { collection: "especification" });
const Alert = mongoose.model("Alert", limitSchema);

router.get("/alert", cors(), async (req, res) => {
  try {
    const alerts = await Alert.find().lean();
    res.json(alerts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
