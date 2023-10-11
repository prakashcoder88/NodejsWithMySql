const express = require("express");
const mysql = require("mysql")
// require("mssql")
const bodyParser = require("body-parser");
const cors = require("cors")

require("dotenv").config();
const PORT = 2000;
// const sequelize = require("sequelize")

const db = require("./src/config/Db.config")
// const userRoutes = require("./src/routes/UserRoutes")
// const adminRoutes = require("./src/routes/AdminRoutes")



const app = express();

// const db = require("./src/models")
// db.sequelize.sync()
// console.log(db);
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) =>{
    res.json("Welcome to My SQL")
})



// app.use("/company",userRoutes,);
// app.use("/company/admin",adminRoutes);

app.listen(PORT, () =>{
    console.log(`Success runing port no ${PORT}`);
})