import { connection, connectionAuth } from "../config/Database.js";

export const uangKurang = async (req, res) => {
  const { idAkun, username, selisih, ket } = req.body;

  const querySelectAcount = `SELECT id_akun, nama_akun FROM akun_jurnal WHERE keterangan='${ket}'`;

  const queryGetUserLogin = `SELECT * FROM user_memsys WHERE user_name='${username}' AND aktif='1';`;

  const queryReftransaction = `SELECT journalentryidno FROM division`;

  const [akunJurnal] = await connection.query(querySelectAcount);
  // console.log(querySelectAcount);
  const idAkunPiutang = akunJurnal[0].id_akun;
  // console.log(akunJurnal);

  const journalentryidno = await connection.query(queryReftransaction);
  const reftransaction = journalentryidno[0];
  const user = await connectionAuth.query(queryGetUserLogin);

  const nama = user[0];
  const ref = getNextRefTransactions(reftransaction[0].journalentryidno);
  const today = await getDate();
  const now = await getTime();

  const queryUpdateJournalEntry = `UPDATE division
    SET journalentryidno = ${reftransaction[0].journalentryidno + 1} 
    WHERE journalentryidno = ${reftransaction[0].journalentryidno};
  `;

  const queryInsertJurnal = `INSERT INTO journal (jtid, jtdate, jttime, memo, memoedit, division, printed, approved, usercreate, useredit)
  VALUES ('${ref}', '${today}', '${now}', 'Uang Kurang (${nama[0].nama})', '', '0011', 0, 1, '${username}', '');`;

  const queryInsertJurnalTransPiutang = `INSERT INTO journaltrans
  (id, jtid, jtdate, memo, division, reftransaction, accountid, approved, debit, credit, usercreate, useredit)
  VALUES
  (NULL, '${ref}', '${today} ${now}', 'Uang Kurang (${nama[0].nama})', '0011', '${ref}', '${idAkunPiutang}', 1, ${selisih}, 0, '${username}', '${username}');`;

  const queryInsertJurnalTransKas = `INSERT INTO journaltrans
  (id, jtid, jtdate, memo, division, reftransaction, accountid, approved, debit, credit, usercreate, useredit)
  VALUES
  (NULL, '${ref}', '${today} ${now}', 'Uang Kurang (${nama[0].nama})', '0011', '${ref}', '${idAkun}', 1, 0, ${selisih}, '${username}', '${username}');`;

  try {
    await connection.query(queryUpdateJournalEntry);
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
  const { idAkun, username, selisih, ket } = req.body;

  const querySelectAcount = `SELECT id_akun, nama_akun FROM akun_jurnal WHERE keterangan='${ket}'`;

  const queryGetUserLogin = `SELECT * FROM user_memsys WHERE user_name='${username}' AND aktif='1';`;

  const queryReftransaction = `SELECT journalentryidno FROM division`;

  const [akunJurnal] = await connection.query(querySelectAcount);
  const idAkunPendapatan = akunJurnal[0].id_akun;

  const journalentryidno = await connection.query(queryReftransaction);
  const reftransaction = journalentryidno[0];
  const user = await connectionAuth.query(queryGetUserLogin);

  const nama = user[0];
  const ref = getNextRefTransactions(reftransaction[0].journalentryidno);
  const today = await getDate();
  const now = await getTime();

  const queryUpdateJournalEntry = `UPDATE division
    SET journalentryidno = ${reftransaction[0].journalentryidno + 1} 
    WHERE journalentryidno = ${reftransaction[0].journalentryidno};
  `;

  const queryInsertJurnal = `INSERT INTO journal (jtid, jtdate, jttime, memo, memoedit, division, printed, approved, usercreate, useredit)
  VALUES ('${ref}', '${today}', '${now}', 'Uang Plus (${nama[0].nama})', '', '0011', 0, 1, '${username}', '');`;

  const queryInsertJurnalTransDebit = `INSERT INTO journaltrans
  (id, jtid, jtdate, memo, division, reftransaction, accountid, approved, debit, credit, usercreate, useredit)
  VALUES
  (NULL, '${ref}', '${today} ${now}', 'Uang Plus (${nama[0].nama})', '0011', '${ref}', '${idAkun}', 1, ${selisih}, 0, '${username}', '${username}');`;

  const queryInsertJurnalTransKredit = `INSERT INTO journaltrans
  (id, jtid, jtdate, memo, division, reftransaction, accountid, approved, debit, credit, usercreate, useredit)
  VALUES
  (NULL, '${ref}', '${today} ${now}', 'Uang Plus (${nama[0].nama})', '0011', '${ref}', '${idAkunPendapatan}', 1, 0, ${selisih}, '${username}', '${username}');`;

  try {
    await connection.query(queryUpdateJournalEntry);
    await connection.query(queryInsertJurnal);
    await connection.query(queryInsertJurnalTransDebit);
    await connection.query(queryInsertJurnalTransKredit);
    console.log("Berhasil insert kas Lebih dengan ref: ", ref);
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

function getNextRefTransactions(number) {
  // Menambahkan 1 ke nilai number
  const incrementedNumber = number + 1;

  // Membuat format string dengan 6 digit angka dan diawali dengan "I/JT-"
  const formattedJtid = `I/JT-${String(incrementedNumber).padStart(6, "0")}`;

  return formattedJtid;
}
