import { connection, connectionAuth } from "../config/Database.js";

export const getCashflow = async (req, res) => {
  const { tanggalAwal, tanggalAkhir, accountId } = req.body;

  const stringQuery = `
    SELECT
      accountid, t1.division, t1.jtid, t1.jtdate, t1.reftransaction, t1.debit, t1.credit, t1.memo 
    FROM 
      journaltrans AS t1 
    WHERE 
      (DATE_FORMAT(t1.jtdate,'%Y/%m/%d') BETWEEN '${tanggalAwal}' AND '${tanggalAkhir}') 
      AND t1.accountid='${accountId}'  
      AND t1.division IN ('0011') 
    ORDER BY 
      t1.jtdate, 
      t1.jtid, 
      t1.debit DESC, 
      t1.credit`;

  const queryDua = `select sum(debit-credit) as balance from journaltrans where approved=1 and (date_format(jtdate,'%Y/%m/%d')<'${tanggalAkhir}') and accountid='${accountId}' and division in ('0011')`;

  try {
    const [responseCashFlow] = await connection.query(stringQuery);
    const [responseBalance] = await connection.query(queryDua);
    console.log("200 | Berhasil");
    res.json({
      status: "success",
      message: "Data Cashflwo",
      data: responseBalance,
      dataJurnalUmum: responseCashFlow,
    });
  } catch (error) {
    console.error("Error fetching cashflow: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const balanceCek = async (req, res) => {
  const { totalKas, tanggalAkhir, accountId } = req.body;

  const stringQuery = `select sum(debit-credit) as balance from journaltrans where approved=1 and (date_format(jtdate,'%Y/%m/%d')<'${tanggalAkhir}') and accountid='${accountId}' and division in ('0011')`;

  try {
    const [response] = await connection.query(stringQuery);
    const balance = response[0].balance;

    const balanceCek = (totalKas, balance) => {
      if (totalKas != balance) {
        return "Tidak balance";
      } else {
        return "Balance";
      }
    };
    console.log("200 | Berhasil");
    res.json({
      status: "Success",
      message: "Cek Balance Cash Flow",
      data: {
        keterangan: balanceCek(totalKas, balance),
        totalKas: totalKas,
        balance: balance,
      },
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const arusKas = async (req, res) => {
  const { tanggalAwal, tanggalAkhir, accountId, username } = req.body;

  const queryGetUserLogin = `SELECT * FROM user_memsys WHERE user_name='${username}' AND aktif='1';`;

  const queryDelete = `delete from tmpkas where k10='${username}'`;

  const querySaldoAwal = `
    INSERT INTO tmpkas (k01, k02, k03, k04, k05, k06, k10) 
    SELECT '01' AS k01, 'Saldo Awal' AS k02, IFNULL(account.name, '') AS k03,
      IFNULL(SUM(journaltrans.debit) - SUM(journaltrans.credit), '0') AS k04,
      '0' AS k05, '${tanggalAwal} 00:00:00' AS k06, '${username}' AS k10
    FROM journaltrans
    INNER JOIN account ON (journaltrans.accountid = account.id)
    WHERE journaltrans.accountid = '${accountId}' AND journaltrans.jtdate < '${tanggalAwal} 00:00:00';`;

  const queryPerubahanKas = `
    INSERT INTO tmpkas (k01, k02, k03, k04, k05, k06, k10) 
    SELECT '02' AS k1, 'Perubahan Kas' AS k2, IFNULL(account.name, '') AS k3, 
      IFNULL(journaltrans.credit, '0') AS k4, IFNULL(journaltrans.debit, '0') AS k5, 
      journaltrans.jtdate AS k6, '${username}' AS k10 
    FROM journaltrans
    INNER JOIN account ON (journaltrans.accountid = account.id)
    WHERE journaltrans.accountid <> '${accountId}' 
      AND (journaltrans.jtdate BETWEEN '${tanggalAwal} 00:00:00' AND '${tanggalAkhir} 23:59:59') 
      AND journaltrans.jtid IN (
        SELECT jtid FROM journaltrans 
        WHERE accountid = '${accountId}' 
          AND jtdate BETWEEN '${tanggalAwal} 00:00:00' AND '${tanggalAkhir} 23:59:59'
      );`;

  const querySaldoAkhir = `
    INSERT INTO tmpkas (k01, k02, k03, k04, k05, k06, k10) 
    SELECT '03' AS k1, 'Saldo Akhir' AS k2, 
      (SELECT IFNULL(account.name, '') FROM account WHERE id = '${accountId}') AS k3, 
      (SELECT SUM(k04) - SUM(k05) FROM tmpkas WHERE k10 = '${username}') AS k4, 
      '0' AS k5, '${tanggalAkhir} 23:59:59' AS k6, '${username}' AS k10 
    FROM tmpkas 
    LIMIT 1;`;

  const queryTerakhir = `SELECT k01, k02, k03, SUM(k04) - SUM(k05) AS jml, k06 
    FROM tmpkas 
    WHERE k10 = '${username}' 
    GROUP BY k03, k01 
    ORDER BY k01, k06 ASC;`;

  try {
    const [userLogin] = await connectionAuth.query(queryGetUserLogin);
    await connection.query(queryDelete);
    await connection.query(querySaldoAwal);
    await connection.query(queryPerubahanKas);
    await connection.query(querySaldoAkhir);
    const [response] = await connection.query(queryTerakhir);
    res.json({
      status: "Success",
      message: "Rekap Arus Kas",
      namaAkun: response[0].k03,
      namaUser: userLogin[0].nama,
      tanggal: {
        awal: tanggalAwal,
        akhir: tanggalAkhir,
      },
      data: response,
    });
  } catch (error) {
    console.error("error: ", error.message);
  }
};
