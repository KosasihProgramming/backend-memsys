import { connection, connectionAuth } from "../config/Database.js";

export const uangKurang = async (req, res) => {
  const { username, selisih } = req.body;

  const queryGetUserLogin = `SELECT * FROM user_memsys WHERE user_name='${username}' AND aktif='1';`;

  const queryReftransaction = `SELECT t1.reftransaction
    FROM journaltrans AS t1
    LEFT JOIN division AS t2 ON t2.id = t1.division
    WHERE t1.approved = 1
      AND DATE(t1.jtdate) = CURDATE()
      AND t1.accountid = '101.002'
      AND t1.division IN ('0011')
    ORDER BY t1.jtdate, t1.jtid, t1.debit DESC, t1.credit;`;

  const reftransaction = await connection.query(queryReftransaction);
  // console.log("ref: ", reftransaction[0]);
  const user = await connectionAuth.query(queryGetUserLogin);

  const nama = user[0];
  const ref = getNextRefTransactions(reftransaction[0]);
  console.log("ref: ", ref[0]);
  const today = await getDate();
  const now = await getTime();

  const queryInsertJurnal = `INSERT INTO journal (jtid, jtdate, jttime, memo, memoedit, division, printed, approved, usercreate, useredit)
  VALUES ('${ref[0]}', '${today}', '${now}', 'Uang Kurang (${nama[0].nama})', '', '0011', 0, 1, '${username}', '');`;

  const queryInsertJurnalTransPiutang = `INSERT INTO journaltrans
  (id, jtid, jtdate, memo, division, reftransaction, accountid, approved, debit, credit, usercreate, useredit)
  VALUES
  (NULL, '${ref[0]}', '${today} ${now}', 'Uang Kurang (${nama[0].nama})', '0011', '${ref[0]}', '104.045', 1, ${selisih}, 0, '${username}', '${username}');`;

  const queryInsertJurnalTransKas = `INSERT INTO journaltrans
  (id, jtid, jtdate, memo, division, reftransaction, accountid, approved, debit, credit, usercreate, useredit)
  VALUES
  (NULL, '${ref[0]}', '${today} ${now}', 'Uang Kurang (${nama[0].nama})', '0011', '${ref[0]}', '101.002', 1, 0, ${selisih}, '${username}', '${username}');`;

  try {
    await connection.query(queryInsertJurnal);
    await connection.query(queryInsertJurnalTransPiutang);
    await connection.query(queryInsertJurnalTransKas);
    console.log("Berhasil insert kas kurang dengan ref: ", ref);
    res.json({
      status: "Success",
      message: "Berhasil insert jurnal kas kurang",
    });
  } catch (error) {
    console.error("error: ", error);
  }
};

export const uangLebih = async (req, res) => {
  const { username, selisih } = req.body;

  const queryGetUserLogin = `SELECT * FROM user_memsys WHERE user_name='${username}' AND aktif='1';`;

  const queryReftransaction = `SELECT t1.reftransaction
    FROM journaltrans AS t1
    LEFT JOIN division AS t2 ON t2.id = t1.division
    WHERE t1.approved = 1
      AND DATE(t1.jtdate) = CURDATE()
      AND t1.accountid = '101.002'
      AND t1.division IN ('0011')
    ORDER BY t1.jtdate, t1.jtid, t1.debit DESC, t1.credit;`;

  const reftransaction = await connection.query(queryReftransaction);
  const user = await connectionAuth.query(queryGetUserLogin);

  const nama = user[0];
  const ref = getNextRefTransactions(reftransaction[0]);
  console.log(ref);
  const today = await getDate();
  const now = await getTime();

  const queryInsertJurnal = `INSERT INTO journal (jtid, jtdate, jttime, memo, memoedit, division, printed, approved, usercreate, useredit)
  VALUES ('${ref}', '${today}', '${now}', 'Uang Plus (${nama[0].nama})', '', '0011', 0, 1, '${username}', '');`;

  const queryInsertJurnalTransDebit = `INSERT INTO journaltrans
  (id, jtid, jtdate, memo, division, reftransaction, accountid, approved, debit, credit, usercreate, useredit)
  VALUES
  (NULL, '${ref}', '${today} ${now}', 'Uang Plus (${nama[0].nama})', '0011', '${ref}', '101.002', 1, ${selisih}, 0, '${username}', '${username}');`;

  const queryInsertJurnalTransKredit = `INSERT INTO journaltrans
  (id, jtid, jtdate, memo, division, reftransaction, accountid, approved, debit, credit, usercreate, useredit)
  VALUES
  (NULL, '${ref}', '${today} ${now}', 'Uang Plus (${nama[0].nama})', '0011', '${ref}', '402.050', 1, 0, ${selisih}, '${username}', '${username}');`;

  try {
    await connection.query(queryInsertJurnal);
    await connection.query(queryInsertJurnalTransDebit);
    await connection.query(queryInsertJurnalTransKredit);
    console.log("Berhasil insert kas Lebih");
    res.json({
      status: "Success",
      message: "Berhasil insert jurnal kas Lebih",
    });
  } catch (error) {
    console.error("error: ", error);
  }
};

// functon
function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTime() {
  const today = new Date();
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  const seconds = String(today.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function getNextRefTransactions(transactions) {
  const numbers = transactions.map((item) =>
    parseInt(item.reftransaction.split("-")[1])
  );

  const maxNumber = Math.max(...numbers);

  const nextRefTransactions = [
    `I/JT-${(maxNumber + 1).toString().padStart(6, "0")}`,
    `I/JT-${(maxNumber + 2).toString().padStart(6, "0")}`,
  ];

  return nextRefTransactions;
}
