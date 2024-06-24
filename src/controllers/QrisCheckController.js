import { connection } from "../config/Database.js";

export const qrisCheck = async (req, res) => {
  const querySelectAcount = `SELECT * FROM akun_qris`;

  const [akunQris] = await connection.query(querySelectAcount);
  const idAkun = akunQris[0].id_akun;
  console.log("id akun qris: ", idAkun);

  const querySelectJurnal = `SELECT t1.division, t2.description AS divisionname, t1.jtid, t1.jtdate, t1.reftransaction, t1.debit, t1.credit, t1.memo
    FROM journaltrans AS t1
    LEFT JOIN division AS t2 
    ON t2.id = t1.division
    WHERE 
      t1.approved = 1 
      AND DATE_FORMAT(t1.jtdate, '%Y/%m/%d') BETWEEN '2024/06/24' AND '2024/06/24'
      AND t1.accountid = '${idAkun}'
      AND t1.division IN ('0011')
    ORDER BY t1.jtdate, t1.jtid, t1.debit DESC, t1.credit;`;

  const querySumJurnal = `SELECT SUM(debit - credit) AS balance
    FROM journaltrans
    WHERE approved = 1
      AND DATE(jtdate) = CURDATE()
      AND accountid = '${idAkun}'
      AND division IN ('0011');`;

  try {
    // const [jurnal] = await connection.query(querySelectJurnal);

    const [balanceResult] = await connection.query(querySumJurnal);
    const balance = balanceResult[0]?.balance || 0;

    res.json({
      status: "Success",
      message: "QRIS Hari ini",
      qrisValue: balance,
      // dataJournal: jurnal,
    });
    console.log("Berhasil mendapatkan balace qris: ", balance);
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
