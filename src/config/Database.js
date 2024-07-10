import mysql from "mysql2";

// const dbConfig = {
//   host: "26.45.147.210",
//   port: "6033",
//   user: "aris",
//   password: "aksa0502",
//   database: "db_acckemiling",
// };

const dbConfig = {
  host: "localhost",
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

export { connection, connectionAuth };
