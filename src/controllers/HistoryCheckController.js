import { connection } from "../config/Database.js";

export const insertHistory = async (req, res) => {
  const {
    user,
    tanggalJurnalAwal,
    tanggalJurnalAkhir,
    namaAkun,
    nominalKasManual,
    nominalKasSistem,
    selisih,
  } = req.body;

  const queryInsert = `INSERT INTO riwayat_check (user, tanggal_cek, tanggal_jurnal_awal, tanggal_jurnal_akhir, nama_akun, nominal_kas_manual, nominal_kas_sistem, selisih) VALUES ('${user}', CURDATE(), '${tanggalJurnalAwal}', '${tanggalJurnalAkhir}', '${namaAkun}', ${nominalKasManual}, ${nominalKasSistem}, ${selisih});`;

  const [response] = await connection.query(queryInsert);
  res.json({
    status: "Success",
    message: "Berhasil insert data riwayat",
  });

  console.log(response);
};

export const insertDetailHistory = async (req, res) => {
  const { idRiwayat, jenisKas, namaKas, nominal } = req.body;

  const queryInsert = `INSERT INTO riwayat_check_detail (id_riwayat_check, jenis_kas, nama_kas, nominal) VALUES (${idRiwayat}, '${jenisKas}', '${namaKas}', ${nominal})`;

  const [response] = await connection.query(queryInsert);
  res.json({
    status: "Success",
    message: "Berhasil insert data detail riwayat",
  });

  console.log(response);
};

export const getHistory = async (req, res) => {
  const { id, user, selisih, tanggalCek } = req.body;

  let where = "";

  if (id == undefined) {
    where = `user='${user}' AND selisih=${selisih} AND tanggal_cek='${tanggalCek}';`;
  } else {
    where = `id='${id}'`;
  }

  const querySelect = `SELECT * FROM riwayat_check WHERE ${where}`;

  try {
    const [response] = await connection.query(querySelect);

    res.status(200).json({
      status: "Berhasil",
      message: "Data Riwayat",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "Gagal",
      message: "Terjadi kesalahan dalam mengambil data riwayat",
      error: error.message,
    });
  }
};

export const getDetailHistory = async (req, res) => {
  const { idHistory } = req.body;

  const querySelect = `SELECT * FROM riwayat_check_detail WHERE id_riwayat_check=${idHistory}`;

  const [response] = await connection.query(querySelect);

  res.json({
    status: "Success",
    message: "Data detail history",
    data: response[0],
  });
};