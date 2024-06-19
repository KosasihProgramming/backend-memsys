import { connection } from "../config/Database.js";

export const createTable = async (req, res) => {
  const createTableModal = `
    CREATE TABLE IF NOT EXISTS clinicmodal (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nominal DOUBLE NOT NULL
    );
  `;

  const createTableRiwayatCheck = `
    CREATE TABLE IF NOT EXISTS riwayat_check (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user VARCHAR(255) NOT NULL,
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
    CREATE TABLE IF NOT EXISTS riwayat (
      id INT AUTO_INCREMENT PRIMARY KEY,
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

  try {
    await connection.query(createTableModal);
    await connection.query(createTableRiwayatCheck);
    await connection.query(createTableRiwayat);
    await connection.query(createTableAkunSetor);
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

  try {
    await connection.query(insertModal);
    await connection.query(insertAkunSetor);
    res.json({
      status: "Success",
      message: "Seeding Success",
    });
    console.log("Seeding Success");
  } catch (error) {
    console.error("Error seeding: ", error.message);
  }
};
