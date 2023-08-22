// const mysql = require("mssql");
const dbconfig = require("../config/Db.config")
const Sequelize = require("sequelize")

const sequelize = new Sequelize(dbconfig.DATABASE,dbconfig.USER,dbconfig.PASSWORD, {
    host:dbconfig.HOST,
    port:dbconfig.PORT,
    dialect:dbconfig.DIALECT,
})

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// console.log(db);

db.database = require("./User") (sequelize, Sequelize);
module.exports = db