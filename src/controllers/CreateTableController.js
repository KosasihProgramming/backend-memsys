import { connection } from "../config/Database.js";

export const createTable = async (req, res) => {
  const createTableModal = `
    CREATE TABLE IF NOT EXISTS clinicmodal (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nominal DOUBLE NOT NULL
    );
  `;

  const createTableRiwayatCheck = `
    CREATE OR REPLACE TABLE riwayat_check (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      tanggal_cek DATE NOT NULL,
      tanggal_jurnal_awal DATE NOT NULL,
      tanggal_jurnal_akhir DATE NOT NULL,
      nama_akun VARCHAR(255) NOT NULL,
      nominal_kas_manual DOUBLE NOT NULL,
      nominal_kas_sistem DOUBLE NOT NULL,
      selisih DOUBLE NOT NULL
    );  
  `;

  const createTableRiwayat = `
    CREATE TABLE IF NOT EXISTS riwayat_check_detail (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_riwayat_check INT,
      jenis_kas VARCHAR(255) NOT NULL,
      nama_kas VARCHAR(255) NOT NULL,
      nominal DOUBLE NOT NULL
    );
  `;

  const createTableAkunSetor = `
    CREATE TABLE IF NOT EXISTS akun_setor (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_akun CHAR(11) NOT NULL,
      nama_akun VARCHAR(255) NOT NULL
    );
  `;

  const createTableAkunJurnal = `
    CREATE TABLE IF NOT EXISTS akun_jurnal (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_akun CHAR(11) NOT NULL,
      nama_akun VARCHAR(255) NOT NULL,
      keterangan VARCHAR(255) NOT NULL
    );
  `;

  const createTableAkunQris = `
    CREATE TABLE IF NOT EXISTS akun_qris (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_akun CHAR(11) NOT NULL,
      nama_akun VARCHAR(255) NOT NULL
    );
  `;

  const createTableAkunPendapatan = `
    CREATE TABLE IF NOT EXISTS akun_pendapatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_akun CHAR(11) NOT NULL,
      nama_akun VARCHAR(255) NOT NULL,
      keterangan VARCHAR(255) NOT NULL
    );
  `;

  // const createTable = `
  //   CREATE TABLE IF NOT EXISTS akun_pendapatan_bpjs (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     id_akun CHAR(11) NOT NULL,
  //     nama_akun VARCHAR(255) NOT NULL,
  //     keterangan VARCHAR(255) NOT NULL
  //   );
  // `;

  try {
    // await connection.query(createTableModal);
    // await connection.query(createTableRiwayatCheck);
    // await connection.query(createTableRiwayat);
    // await connection.query(createTableAkunSetor);
    // await connection.query(createTableAkunJurnal);
    // await connection.query(createTableAkunQris);
    // await connection.query(createTableAkunPendapatan);
    res.json({
      status: "Success",
      message:
        "Table 'clinicmodal', 'riwayat_check', 'akun_setor' created successfully.",
    });
    console.log(
      "Table 'clinicmodal', 'riwayat_check', 'akun_setor' created successfully."
    );
  } catch (error) {
    console.error("Error creating table:", error.message);
  }
};

export const seedingTable = async (req, res) => {
  const insertModal = `
    INSERT INTO clinicmodal (id, nominal)
    VALUES (1, 1000000);  
  `;

  const insertAkunSetor = `
    INSERT INTO akun_setor (id, id_akun, nama_akun)
    VALUES (1, 102.003, 'Bank 3');
  `;

  const insertAkunJurnal = `
    INSERT INTO akun_jurnal (id, id_akun, nama_akun, keterangan)
    VALUES (1, 104.045, 'Piutang Karyawan', 'Uang Kurang'),
          (2, 701.099, 'Pendapatan lain-lain', 'Uang Lebih');
  `;

  const insertAkunQris = `
    INSERT INTO akun_qris (id, id_akun, nama_akun)
    VALUES (1, 102.002, 'E-Wallet QRIS (12345678)');
  `;

  const insertAkunPendapatan = `
    INSERT INTO akun_pendapatan (id, id_akun, nama_akun, keterangan)
    VALUES (1, '401.007', 'Pendapatan barang klinik', 'barang klinik'),
          (2, '401.008', 'Pendapatan jasa klinik', 'jasa klinik'),
          (3, '401.009', 'Pendapatan barang lab', 'barang lab'),
          (4, '401.010', 'Pendapatan jasa lab', 'jasa lab'),
          (5, '401.011', 'Pendapatan barang gigi', 'barang gigi'),
          (6, '401.012', 'Pendapatan jasa gigi', 'jasa gigi');
  `;

  const insertAkunPendapatanBPJS = `
    INSERT INTO akun_pendapatan (id, id_akun, nama_akun, keterangan)
    VALUES (7, '104.006', 'Piutang Bpjs Kesehatan', 'bpjs');
  `;

  try {
    // await connection.query(insertModal);
    // await connection.query(insertAkunSetor);
    // await connection.query(insertAkunJurnal);
    // await connection.query(insertAkunQris);
    // await connection.query(insertAkunPendapatan);
    await connection.query(insertAkunPendapatanBPJS);
    res.json({
      status: "Success",
      message: "Seeding Success",
    });
    console.log("Seeding Success");
  } catch (error) {
    console.error("Error seeding: ", error.message);
  }
};
