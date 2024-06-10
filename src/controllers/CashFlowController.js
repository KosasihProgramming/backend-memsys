import { connection, connectionAuth } from "../config/Database.js";

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

  const queryNamaPerusahaan = `select name from company;`;

  const queryAkunSetor = `SELECT * FROM akun_setor;`;
  const queryModal = `SELECT * FROM clinicmodal;`;

  try {
    const [userLogin] = await connectionAuth.query(queryGetUserLogin);
    await connection.query(queryDelete);
    await connection.query(querySaldoAwal);
    await connection.query(queryPerubahanKas);
    await connection.query(querySaldoAkhir);
    const [response] = await connection.query(queryTerakhir);
    const [responseCompany] = await connection.query(queryNamaPerusahaan);
    const [responseAkunSetor] = await connection.query(queryAkunSetor);
    const [responseModal] = await connection.query(queryModal);

    let dataSetor = await filterData(response, responseAkunSetor[0].nama_akun);

    const saldoAwal = await filterSaldoAwal(response);

    if (dataSetor == undefined) {
      dataSetor = {
        k03: "Tidak nyetor",
        jml: "Tidak nyetor",
      };
    }

    let sisaModal = saldoAwal.jml - makePositive(dataSetor.jml);
    if (isNaN(sisaModal)) sisaModal = "Belum dikurangi";

    res.json({
      status: "Success",
      message: "Rekap Arus Kas",
      namaAkun: response[0].k03,
      namaUser: userLogin[0].nama,
      namaPerusahaan: responseCompany[0].name,
      tanggal: {
        awal: tanggalAwal,
        akhir: tanggalAkhir,
      },
      data: response,
      dataSetor: {
        namaAkunSetor: dataSetor.k03,
        yangDisetor: makePositive(dataSetor.jml),
        sisaModal: sisaModal,
        modalSeharusnya: responseModal[0].nominal,
      },
    });
    console.log("Berhasil!");
  } catch (error) {
    console.error("error: ", error.message);
  }
};

// function
function filterData(data, value) {
  return data.find((obj) => obj.k03 === value);
}

function makePositive(value) {
  if (typeof value === "number") {
    return Math.abs(value);
  }
  return value;
}

function filterSaldoAwal(data) {
  return data.find((obj) => obj.k02 === "Saldo Awal");
}
