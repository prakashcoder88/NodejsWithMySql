// const Connection = require("tedious").Connection;
const Connection = require("mssql");
const { USER,PASSWORD,HOST,PORT,DATABASE,DIALECT } = process.env;
let config = {
  server: 'prakash.company.localhost',
  port:PORT,
  // database:database,
  authentication: {
    type: "default",
    options: {
      userName: USER,
      password: PASSWORD,
    },
  },
};


var connection = new Connection(config)
  Connection.on("connect", function (err) {
    if (!err) {
      console.log("Not Connected");
    } else {
      console.log("Connected");
    
    }
    console.log(Connection);
  });
  Connection.connect();



// console.log(connection);



// module.exports = {
//   HOST: HOST,
//   PORT: PORT,
//   USER: USER,
//   PASSWORD: PASSWORD,
//   DATABASE: DATABASE,
//   DIALECT:DIALECT
// }
