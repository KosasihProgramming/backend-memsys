import { connectionAuth } from "../config/Database.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const queryLogin = `SELECT * FROM user_memsys WHERE user_name='${username}' AND pass_word IN(SELECT SHA('${password}')) AND aktif='1'`;

    const [response] = await connectionAuth.query(queryLogin);
    if (response.length === 0) {
      return res.json({
        status: "Error",
        message: "Username atau password salah",
      });
    }
    res.json({
      status: "Success",
      message: "Berhasil login",
      user: response[0],
    });
    console.log("Si User Login");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "Error", error: error.message });
  }
};
