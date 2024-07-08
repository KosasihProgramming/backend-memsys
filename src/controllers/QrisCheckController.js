import { connection, connectionAuth } from "../config/Database.js";

export const qrisCheck = async (req, res) => {
  const { username } = req.body;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  // const tanggalHariIni = `${year}-${month}-${day}`;

  const accountId = "102.002";
  const accountId2 = "102.003";
  const tanggalAwal = `${year}-${month}-${day}`;
  const tanggalAkhir = `${year}-${month}-${day}`;

  const queryGetUserLogin = `SELECT * FROM user_memsys WHERE user_name='${username}' AND aktif='1';`;

  const queryDelete = `delete from tmpkas where k10='HG001.Hg';`;

  const querySaldoAwal = `
    INSERT INTO tmpkas (k01, k02, k03, k04, k05, k06, k07, k08, k10)
    SELECT 
        '01' AS k01,
        'Saldo Awal' AS k02, 
        '' AS k03,
        '' AS k04,
        IFNULL(account.name, '') AS k05,
        IFNULL(SUM(journaltrans.debit) - SUM(journaltrans.credit), 0) AS k06,
        '0' AS k07,
        '${tanggalAwal} 00:00:00' AS k08,
        '${username}' AS k10 
    FROM 
        journaltrans 
    INNER JOIN 
        account 
    ON 
        journaltrans.accountid = account.id
    WHERE 
        journaltrans.accountid = '${accountId}' 
        AND journaltrans.jtdate < '${tanggalAwal} 00:00:00';`;

  const queryPerubahanKasMasuk = `
    INSERT INTO tmpkas (k01, k02, k03, k04, k05, k06, k07, k08, k10)
    SELECT 
        '02' AS k01,
        'Perubahan Kas' AS k02,
        'Kas Masuk' AS k03,
        journaltrans.jtid AS k04,
        journaltrans.memo AS k05, 
        journaltrans.credit AS k06, 
        journaltrans.debit AS k07,
        journaltrans.jtdate AS k08,
        '${username}' AS k10 
    FROM 
        journaltrans 
    INNER JOIN 
        account 
    ON 
        journaltrans.accountid = account.id 
    WHERE 
        journaltrans.credit > 0 
        AND journaltrans.accountid NOT IN ('${accountId}', '${accountId2}')
        AND journaltrans.jtdate BETWEEN '${tanggalAwal} 00:00:00' AND '${tanggalAkhir} 23:59:59' 
        AND journaltrans.jtid IN (
            SELECT jtid 
            FROM journaltrans 
            WHERE accountid IN ('${accountId}', '${accountId2}')
            AND jtdate BETWEEN '${tanggalAwal} 00:00:00' AND '${tanggalAkhir} 23:59:59');`;

  const queryPerubahanKasKeluar = `
    INSERT INTO tmpkas (k01, k02, k03, k04, k05, k06, k07, k08, k10)
    SELECT 
        '02' AS k01,
        'Perubahan Kas' AS k02,
        'Kas Keluar' AS k03,
        journaltrans.jtid AS k04,
        journaltrans.memo AS k05, 
        journaltrans.credit AS k06, 
        journaltrans.debit AS k07,
        journaltrans.jtdate AS k08,
        '${username}' AS k10 
    FROM 
        journaltrans 
    INNER JOIN 
        account 
    ON 
        journaltrans.accountid = account.id 
    WHERE 
        journaltrans.debit > 0 
        AND journaltrans.accountid NOT IN ('${accountId}', '${accountId2}')
        AND journaltrans.jtdate BETWEEN '${tanggalAwal} 00:00:00' AND '${tanggalAkhir} 23:59:59'
        AND journaltrans.jtid IN (
            SELECT jtid 
            FROM journaltrans 
            WHERE accountid IN ('${accountId}', '${accountId2}')
            AND jtdate BETWEEN '${tanggalAwal} 00:00:00' AND '${tanggalAkhir} 23:59:59');`;

  const querySaldoAkhir = `
    INSERT INTO tmpkas (k01, k02, k03, k04, k05, k06, k07, k08, k10)
    SELECT 
        '03' AS k01,
        'Saldo Akhir' AS k02,
        '' AS k03,
        '' AS k04,
        (SELECT account.name FROM account WHERE id = '${accountId}') AS k05,
        (SELECT SUM(k06) - SUM(k07) FROM tmpkas WHERE k10 = '${username}') AS k06,
        '0' AS k07,
        '${tanggalAkhir} 23:59:59' AS k08,
        '${username}' AS k10
    FROM tmpkas LIMIT 1;`;

  const queryNamaPerusahaan = `select name from company;`;

  const queryTerakhir = `SELECT k01, k02, k03, k04, k05, SUM(k06) - SUM(k07) AS jml, k08 FROM tmpkas WHERE k10='${username}' GROUP BY k04, k08 ORDER BY k01 ASC, k03 DESC, k08 ASC`;

  try {
    const [userLogin] = await connectionAuth.query(queryGetUserLogin);
    await connection.query(queryDelete);
    // await connection.query(querySaldoAwal);
    await connection.query(queryPerubahanKasMasuk);
    await connection.query(queryPerubahanKasKeluar);
    await connection.query(querySaldoAkhir);
    const [response] = await connection.query(queryTerakhir);
    const [responseCompany] = await connection.query(queryNamaPerusahaan);

    const detailQris = response.filter((item) => item.k01 !== "03");
    const totalQrisHariIni = detailQris.reduce(
      (total, item) => total + item.jml,
      0
    );

    const saldoAkhir = {
      k01: "03",
      k02: "Saldo Akhir",
      k03: "",
      k04: "",
      k05: "E-Wallet QRIS",
      jml: totalQrisHariIni,
      k08: tanggalAwal,
    };

    console.log(detailQris);
    detailQris.push(saldoAkhir);

    console.log("Berhasil");
    res.json({
      status: "Success",
      message: "Rekap qris hari ini",
      namaAkun: "E-Wallet QRIS",
      namaUser: userLogin[0].nama,
      namaPerusahaan: responseCompany[0].name,
      detailQris: detailQris,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: error,
    });
  }
};
