const mysql = require("mysql2");

const dbConfig = {
  host: "localhost",
  // port: "6033",
  user: "root",
  password: "",
  database: "acosys_test",
};

const dbAuth = {
  host: "localhost",
  user: "aris",
  password: "aksa0502",
  database: "db_memsys",
};

const pool = mysql.createPool(dbConfig);
const connection = pool.promise();

const poolAuth = mysql.createPool(dbAuth);
const connectionAuth = poolAuth.promise();

module.exports = { connection, connectionAuth };
