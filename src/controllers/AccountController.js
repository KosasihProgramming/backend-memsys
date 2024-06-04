import connection from "../config/Database.js";

export const acountsIndex = async (req, res) => {
  console.log("Dijalankan");
  const stringQuery = `SELECT id, name FROM account WHERE accountgroup IN(101, 102)`;
  try {
    const [response, fild] = await connection.query(stringQuery);
    res.json({
      status: "success",
      message: "List Nama Akun",
      data: response,
    });
  } catch (error) {
    console.log("error: ", error.message);
  }
};
