import { connectionVps } from "../config/Database.js";

export const insertPenjualanHarian = async (data) => {
  const query = `
    INSERT INTO penjualan_harian (id_cabang, id_penjualan_bulanan, dari_tanggal, sampai_tanggal, timestamp, penjualan_barang, penjualan_jasa, diskon, omset) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.id_cabang,
    data.id_penjualan_bulanan,
    data.dari_tanggal,
    data.sampai_tanggal,
    data.timestamp,
    data.penjualan_barang,
    data.penjualan_jasa,
    data.diskon,
    data.omset,
  ];

  try {
    const [result] = await connectionVps.execute(query, values);
    console.log("Insert successful, ID:", result.insertId);
    return result;
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

export const insertPenjualanBulanan = async (data) => {
  const query = `
    INSERT INTO penjualan_bulanan 
    (id_cabang, tahun, bulan, tanggal_mulai, tanggal_berakhir, timestamp, target_omset, total_barang, total_jasa, total_omset, persentase_capaian) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.id_cabang,
    data.tahun,
    data.bulan,
    data.tanggal_mulai,
    data.tanggal_berakhir,
    data.timestamp,
    data.target_omset,
    data.total_barang,
    data.total_jasa,
    data.total_omset,
    data.persentase_capaian,
  ];

  try {
    const [result] = await connectionVps.execute(query, values);
    console.log("Insert successful, ID:", result.insertId);
    return result;
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error; // Lempar error kembali agar bisa ditangani di tempat lain
  }
};

export const namaKlinik = [
  {
    id: 1,
    nama_cabang: "Klinik Pratama Kosasih Kemiling",
  },
  {
    id: 2,
    nama_cabang: "Laboratorium Kosasih Kemiling",
  },
  {
    id: 3,
    nama_cabang: "Griya Terapi Sehat Kemiling",
  },
  {
    id: 4,
    nama_cabang: "Klinik Rawat Inap Sumber Waras BPJS Kesehatan",
  },
  {
    id: 5,
    nama_cabang: "Laboratorium Sumber Waras",
  },
  {
    id: 6,
    nama_cabang: "Klinik Kosasih Rawat Inap Sumber Waras",
  },
  {
    id: 7,
    nama_cabang: "Klinik Kosasih Rawap Inap Rajabasa",
  },
  {
    id: 8,
    nama_cabang: "Laboratorium Kosasih Rajabasa",
  },
  {
    id: 9,
    nama_cabang: "Klinik Kosasih Rawat Inap Urip",
  },
  {
    id: 10,
    nama_cabang: "Laboratorium Kosasih Urip",
  },
  {
    id: 11,
    nama_cabang: "Klinik Rawat Inap Kosasih Urip (Gigi)",
  },
  {
    id: 12,
    nama_cabang: "Klinik Pratama Kosasih Tugu",
  },
  {
    id: 13,
    nama_cabang: "Laboratorium Kosasih Tugu",
  },
  {
    id: 14,
    nama_cabang: "Klinik Pratama Kosasih Tugu (gigi)",
  },
  {
    id: 15,
    nama_cabang: "Klinik Pratama Kosasih Tirtayasa",
  },
  {
    id: 16,
    nama_cabang: "Laboratorium Kosasih Tirtayasa",
  },
  {
    id: 17,
    nama_cabang: "Griya Terapi Sehat Tirtyasa",
  },
  {
    id: 18,
    nama_cabang: "Klinik Pratama Kosasih Panjang",
  },
  {
    id: 19,
    nama_cabang: "Klinik Pratama Kosasih Teluk",
  },
  {
    id: 20,
    nama_cabang: "Klinik Pratama Kosasih Amanah",
  },
  {
    id: 21,
    nama_cabang: "Klinik Pratama Kosasih Palapa",
  },
  {
    id: 22,
    nama_cabang: "Klinik Kosasih Palapa BPJS Kesehatan",
  },
];

export const filterDataCabang = (dataArray, idArray) => {
  if (!Array.isArray(dataArray) || !Array.isArray(idArray)) {
    throw new Error("Parameter harus berupa array.");
  }
  return dataArray.filter((item) => idArray.includes(item.id));
};

export const filterPendapatanBulanan = (dataArray, judul) => {
  if (!Array.isArray(dataArray) || typeof judul !== "string") {
    throw new Error("Parameter harus berupa array dan string.");
  }

  const lowerCaseJudul = judul.toLowerCase();

  return dataArray.filter(
    (item) => item.Judul.toLowerCase() === lowerCaseJudul
  );
};

export const getCurrentDateArray = (parameter = null) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const today = new Date();
  const date = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();

  switch (parameter) {
    case "tanggal":
      return date.toString();
    case "bulan":
      return month;
    case "tahun":
      return year.toString();
    default:
      return [date.toString(), month, year.toString()];
  }
};

export const getTanggalInterval = (bulan, tahun) => {
  const bulanMap = {
    Januari: 1,
    Februari: 2,
    Maret: 3,
    April: 4,
    Mei: 5,
    Juni: 6,
    Juli: 7,
    Agustus: 8,
    September: 9,
    Oktober: 10,
    November: 11,
    Desember: 12,
  };
  const month = bulanMap[bulan];
  const year = parseInt(tahun);

  if (!month || isNaN(year)) {
    throw new Error("Bulan atau tahun tidak valid");
  }
  const tanggalMulai = new Date(year, month - 1, 1);
  const tanggalBerakhir = new Date(year, month, 0);

  const formatTanggal = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  return {
    tanggalMulai: formatTanggal(tanggalMulai),
    tanggalBerakhir: formatTanggal(tanggalBerakhir),
  };
};
