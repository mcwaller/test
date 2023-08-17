const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = express.Router();

// Si quieres aplicar CORS globalmente a todas las rutas, usa la línea siguiente:
// router.use(cors());

// Esquema para Departamentos
const departamentoSchema = new mongoose.Schema({}, { collection: "lectures" });

const Departamento = mongoose.model("Departamento", departamentoSchema);

router.get("/departamentos", cors(), async (req, res) => {
    try {
      const departamentos = await Departamento.find().lean();
      res.json(departamentos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
