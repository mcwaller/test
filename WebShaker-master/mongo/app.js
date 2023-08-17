const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3011;

app.use(cors());
// Define the Mongoose schema for the "departamentos" collection
const departamentoSchema = new mongoose.Schema({}, { collection: "lectures" }); // Specify the existing collection name here
/* const ghouse = new mongoose.Schema({}, { collection: "greenhouse" });
const module = new mongoose.Schema({}, { collection: "modules" });
const plant = new mongoose.Schema({}, { collection: "plants" });
const notes = new mongoose.Schema({}, { collection: "notes" }); */

const Departamento = mongoose.model("Departamento", departamentoSchema);
/* const GHOUSE = mongoose.model("GHOUSE", ghouse);
const MODULE = mongoose.model("MODULE", module);
const PLANT = mongoose.model("PLANT", plant);
const NOTES = mongoose.model("NOTE", notes); */

// CONEXION A BD
const user = "Luis"; //'lecsaenz02'
const pwd = "0123456789"; //'zoyWEL7C5GvDF6gp'
const db = "greencastle";
const uri = `mongodb+srv://${user}:${pwd}@clus.yi5exca.mongodb.net/${db}?retryWrites=true&w=majority`;
/* const uri2 = `mongodb+srv://Fallen:halo3.pkmn@fallensandbox.9kk8zle.mongodb.net/iotdb_0321101348`;*/
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("BD conectada profe!"))
  .catch((e) => console.log(e));

// Create a route to fetch values from "departamentos"
app.get("/departamentos", async (req, res) => {
  try {
    const departamentos = await Departamento.find().lean();
    res.json(departamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/* 




app.get("/squares", async (req, res) => {
  try {
    const ghouse = await GHOUSE.find().lean();
    const module = await MODULE.find().lean();
    const plant = await PLANT.find().lean();
    const notes = await NOTES.find().lean();

    res.json(ghouse);
    res.json(module);
    res.json(plant);
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
}); */

app.listen(port, () => {
  console.log("Servidor en", port);
});
