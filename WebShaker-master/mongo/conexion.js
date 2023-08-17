const mongoose = require("mongoose");

const user = "Luis"; 
const pwd = "0123456789"; 
const db = "greencastle";
const uri = `mongodb+srv://${user}:${pwd}@clus.yi5exca.mongodb.net/${db}?retryWrites=true&w=majority`;

const conectarDB = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("BD conectada profe!");
    } catch (error) {
        console.log(error);
        process.exit(1); // Detiene la app si hay un error
    }
};

module.exports = conectarDB;