import { connection, connectionVps } from "../config/Database.js";
import fetch from "node-fetch";
import axios from "axios";
import {
  filterDataCabang,
  filterPendapatanBulanan,
  namaKlinik,
  getCurrentDateArray,
  getTanggalInterval,
} from "../functions/Omset.js";

// Variabel setiap klinik berbeda ya
const token = "wFcCXiNy1euYho73dBGwkPhjjTdODzv6";
const idCabang = [1, 2]; //Kosasih Kemiling

export const getPendapatan = async (req, res) => {
  const port = 5000;

  try {
    const response = await fetch(`http://localhost:${port}/pendapatan/cek`);
    const dataResponse = await response.json();

    res.json({
      dataKlinik: dataResponse.pendapatanKlinik,
      dataLab: dataResponse.pendapatanLab,
      dataGigi: dataResponse.pendapatanGigi,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

export const getCabangKlinik = async (req, res) => {
  try {
    const response = await axios({
      method: "GET",
      url: "http://202.157.189.177:8080/api/database/rows/table/662/?user_field_names=true",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    const data = response.data.results;

    const dataFiltered = filterDataCabang(data, idCabang);
    res.json(dataFiltered);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

export const getPendapatanBulanan = async (req, res) => {
  try {
    const response = await axios({
      method: "GET",
      url: "http://202.157.189.177:8080/api/database/rows/table/663/?user_field_names=true",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    const data = response.data.results;

    const dataFiltered = filterPendapatanBulanan(
      data,
      "Penjualan Klinik Kemiling July 2024"
    );
    res.json(dataFiltered);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

export const insertPendapatanBulanan = async (req, res) => {
  const port = 5000;
  const response = await fetch(`http://localhost:${port}/pendapatan/cek`);
  const dataResponse = await response.json();

  const omset = [
    {
      pendapatanBarangKlinik: dataResponse.pendapatanKlinik.barang,
      pendapatanJasaKlinik: dataResponse.pendapatanKlinik.jasa,
    },
    {
      pendapatanBarangLab: dataResponse.pendapatanLab.barang,
      pendapatanJasaLab: dataResponse.pendapatanLab.jasa,
    },
    {
      pendapatanBarangGigi: dataResponse.pendapatanGigi.barang,
      pendapatanJasaGigi: dataResponse.pendapatanGigi.jasa,
    },
  ];

  const bulan = getCurrentDateArray("bulan");
  const tahun = getCurrentDateArray("tahun");
  const judul = [
    `Penjualan ${namaKlinik[0].nama_cabang} ${bulan} ${tahun}`,
    `Penjualan ${namaKlinik[1].nama_cabang} ${bulan} ${tahun}`,
    `Penjualan ${namaKlinik[2].nama_cabang} ${bulan} ${tahun}`,
  ];

  const intervalBulanIni = getTanggalInterval(bulan, tahun);

  try {
    for (let i = 0; i < omset.length; i++) {
      const data = {
        Judul: judul[i],
        "Id Cabang": [i + 1],
        Tahun: tahun,
        Bulan: bulan,
        "Tanggal Mulai": intervalBulanIni.tanggalMulai,
        "Tanggal Berakhir": intervalBulanIni.tanggalBerakhir,
        "Target Omset":
          omset[i].pendapatanBarangKlinik + omset[i].pendapatanJasaKlinik,
        "Total Barang": omset[i].pendapatanBarangKlinik,
        "Total Jasa": omset[i].pendapatanJasaKlinik,
        "Total Omset":
          omset[i].pendapatanBarangKlinik + omset[i].pendapatanJasaKlinik,
        "Persentase Capaian": "string",
        "Created At": new Date().toISOString(),
        PenjualanHarian: [1], // Adjust this as needed
      };

      await axios({
        method: "POST",
        url: "http://202.157.189.177:8080/api/database/rows/table/663/?user_field_names=true",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      });
    }

    res.json({
      status: "Berhasil insert data",
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};
