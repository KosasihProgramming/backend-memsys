import { connection } from "../config/Database.js";
import fetch from "node-fetch";
import { db } from "../config/Firebase.js";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getYesterday,
  getMonthStartEndTimestamps,
} from "../functions/Utils.js";

export const getAllPendapatan = async (req, res) => {
  const querySelectAcount = `SELECT * FROM akun_pendapatan`;

  const [akunPendapatan] = await connection.query(querySelectAcount);
  const idPendapatanBarangKlinik = akunPendapatan[0].id_akun;
  const idPendapatanJasaKlinik = akunPendapatan[1].id_akun;
  const idPendapatanBarangLab = akunPendapatan[2].id_akun;
  const idPendapatanJasaLab = akunPendapatan[3].id_akun;
  const idPendapatanBarangGigi = akunPendapatan[4].id_akun;
  const idPendapatanJasaGigi = akunPendapatan[5].id_akun;
  // console.log({
  //   barangKlinik: idPendapatanBarangKlinik,
  //   jasaKlinik: idPendapatanJasaKlinik,
  //   barangLab: idPendapatanBarangLab,
  //   jasaLab: idPendapatanJasaLab,
  //   barangGigi: idPendapatanBarangGigi,
  //   jasaGigi: idPendapatanJasaGigi,
  // });

  const queryNamaPerusahaan = `select name from company;`;

  const queryGetPendapatanBarangKlinik = `
    SELECT SUM(debit - credit) AS balance
    FROM journaltrans
    WHERE approved = 1
      AND DATE(jtdate) = CURDATE()
      AND accountid = '${idPendapatanBarangKlinik}'
      AND division IN ('0011');`;

  const queryGetPendapatanJasaKlinik = `
    SELECT SUM(debit - credit) AS balance
    FROM journaltrans
    WHERE approved = 1
      AND DATE(jtdate) = CURDATE()
      AND accountid = '${idPendapatanJasaKlinik}'
      AND division IN ('0011');`;

  const queryGetPendapatanBarangLab = `
    SELECT SUM(debit - credit) AS balance
    FROM journaltrans
    WHERE approved = 1
      AND DATE(jtdate) = CURDATE()
      AND accountid = '${idPendapatanBarangLab}'
      AND division IN ('0011');`;

  const queryGetPendapatanJasaLab = `
    SELECT SUM(debit - credit) AS balance
    FROM journaltrans
    WHERE approved = 1
      AND DATE(jtdate) = CURDATE()
      AND accountid = '${idPendapatanJasaLab}'
      AND division IN ('0011');`;

  const queryGetPendapatanBarangGigi = `
    SELECT SUM(debit - credit) AS balance
    FROM journaltrans
    WHERE approved = 1
      AND DATE(jtdate) = CURDATE()
      AND accountid = '${idPendapatanBarangGigi}'
      AND division IN ('0011');`;

  const queryGetPendapatanJasaGigi = `
    SELECT SUM(debit - credit) AS balance
    FROM journaltrans
    WHERE approved = 1
      AND DATE(jtdate) = CURDATE()
      AND accountid = '${idPendapatanJasaGigi}'
      AND division IN ('0011');`;

  try {
    const [namaPerusahaan] = await connection.query(queryNamaPerusahaan);
    const [pendapatanBarangKlinik] = await connection.query(
      queryGetPendapatanBarangKlinik
    );
    const [pendapatanJasaKlinik] = await connection.query(
      queryGetPendapatanJasaKlinik
    );
    const [pendapatanBarangLab] = await connection.query(
      queryGetPendapatanBarangLab
    );
    const [pendapatanJasaLab] = await connection.query(
      queryGetPendapatanJasaLab
    );
    const [pendapatanBarangGigi] = await connection.query(
      queryGetPendapatanBarangGigi
    );
    const [pendapatanJasaGigi] = await connection.query(
      queryGetPendapatanJasaGigi
    );

    console.log(pendapatanBarangKlinik);

    res.json({
      status: "Success",
      message: "Pendapatan hari kemarin",
      namaKlinik: "Kemiling",
      pendapatanKlinik: {
        jenis: "Klinik",
        barang: Math.abs(pendapatanBarangKlinik[0].balance),
        jasa: Math.abs(pendapatanJasaKlinik[0].balance),
      },
      pendapatanLab: {
        jenis: "Lab",
        barang: Math.abs(pendapatanBarangLab[0].balance),
        jasa: Math.abs(pendapatanJasaLab[0].balance),
      },
      pendapatanGigi: {
        jenis: "Gigi",
        barang: Math.abs(pendapatanBarangGigi[0].balance),
        jasa: Math.abs(pendapatanJasaGigi[0].balance),
      },
    });
  } catch (error) {
    console.error("Error fetching data: ", error.message);
    throw new Error("Error fetching pendapatan data");
  }
};

export const getPerusahaan = async (req, res) => {
  const { namaKlinik } = req.params;

  const perusahaanId = "42c0276C84e8chpCogKK";

  try {
    const perusahaanDocRef = doc(db, "Perusahaan", perusahaanId);

    const q = query(
      collection(db, "CabangPerusahaan"),
      where("refPerusahaan", "==", perusahaanDocRef)
    );
    const querySnapshot = await getDocs(q);
    const cabangPerusahaanList = [];
    querySnapshot.forEach((doc) => {
      cabangPerusahaanList.push({ id: doc.id, ...doc.data() });
    });

    const kataKunci = namaKlinik;

    const hasilFilter = await cabangPerusahaanList.filter((item) =>
      item.nama.toLowerCase().includes(kataKunci.toLowerCase())
    );
    res.json(hasilFilter);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const insertPendapatanKlinik = async (req, res) => {
  const cabang = "Klinik Kosasih Rawat Inap Urip";
  const port = 5000;
  const response = await fetch(`http://localhost:${port}/pendapatan/cek`);
  const dataResponse = await response.json();
  const sekarang = Date.now();

  const yesterdayDate = getYesterday();
  const tanggalInterval = getMonthStartEndTimestamps(
    yesterdayDate.year,
    yesterdayDate.month
  );

  const timestampTanggalMulai = Timestamp.fromMillis(
    tanggalInterval.tanggalMulai
  );
  const timestampTanggalBerakhir = Timestamp.fromMillis(
    tanggalInterval.tanggalBerakhir
  );
  const timestampTimestampt = Timestamp.fromMillis(yesterdayDate.timestamp);
  const refPerusahaan = doc(db, "Perusahaan", "42c0276C84e8chpCogKK");
  const refCabang = doc(db, "CabangPerusahaan", "8wPOwHtFu27XGssQ7vTx");
  const tanggalInput = Timestamp.fromMillis(sekarang);

  console.log("tanggalInput: ", tanggalInput);

  const dataOmset = {
    cabang: cabang,
    refPerusahaan: refPerusahaan,
    refCabang: refCabang,
    bulan: yesterdayDate.month,
    tahun: String(yesterdayDate.year),
    tanggalMulai: timestampTanggalMulai,
    tanggalBerakhir: timestampTanggalBerakhir,
    timestampt: timestampTimestampt,
    targetOmset: 200000000,
    totalBarang: 0,
    totalJasa: 0,
    totalDiskon: 0,
    totalOmset: 0,
  };

  const penjualanHarian = [
    {
      cabang: cabang,
      refPerusahaan: refPerusahaan,
      refCabang: refCabang,
      dariTanggal: timestampTimestampt,
      sampaiTanggal: timestampTimestampt,
      timestamp: tanggalInput,
      penjualanBarang: dataResponse.pendapatanKlinik.barang,
      penjualanJasa: dataResponse.pendapatanKlinik.jasa,
      diskon: 0,
      omset:
        dataResponse.pendapatanKlinik.barang +
        dataResponse.pendapatanKlinik.jasa,
    },
  ];

  try {
    const existingDocRef = await checkExistingDocument(
      String(yesterdayDate.year),
      yesterdayDate.month,
      cabang
    );

    let docRef;
    if (existingDocRef) {
      docRef = existingDocRef;
    } else {
      docRef = doc(collection(db, "dates"));
      await setDoc(docRef, dataOmset);
    }

    for (const penjualan of penjualanHarian) {
      const subDocRef = doc(collection(docRef, "penjualanHarian"));
      await setDoc(subDocRef, penjualan);
    }

    await fetch(`http://localhost:${port}/pendapatan/update/klinik`);

    res.status(200).json({ message: "Data successfully saved." });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Error saving data" });
  }
};

export const insertPendapatanLab = async (req, res) => {
  const cabang = "Laboratorium Kosasih Urip";
  const port = 5000;
  const response = await fetch(`http://localhost:${port}/pendapatan/cek`);
  const dataResponse = await response.json();

  const yesterdayDate = getYesterday();
  const tanggalInterval = getMonthStartEndTimestamps(
    yesterdayDate.year,
    yesterdayDate.month
  );

  const timestampTanggalMulai = Timestamp.fromMillis(
    tanggalInterval.tanggalMulai
  );
  const timestampTanggalBerakhir = Timestamp.fromMillis(
    tanggalInterval.tanggalBerakhir
  );
  const timestampTimestampt = Timestamp.fromMillis(yesterdayDate.timestamp);
  const refPerusahaan = doc(db, "Perusahaan", "42c0276C84e8chpCogKK");
  const refCabang = doc(db, "CabangPerusahaan", "NEk9AZRubL6TWMTm1HJe");

  const dataOmset = {
    cabang: cabang,
    refPerusahaan: refPerusahaan,
    refCabang: refCabang,
    bulan: yesterdayDate.month,
    tahun: String(yesterdayDate.year),
    tanggalMulai: timestampTanggalMulai,
    tanggalBerakhir: timestampTanggalBerakhir,
    timestampt: timestampTimestampt,
    targetOmset: null,
    totalBarang: null,
    totalJasa: null,
    totalDiskon: 0,
    totalOmset: null,
  };

  const penjualanHarian = [
    {
      cabang: cabang,
      refPerusahaan: refPerusahaan,
      refCabang: refCabang,
      dariTanggal: timestampTimestampt,
      sampaiTanggal: timestampTimestampt,
      timestamp: timestampTimestampt,
      penjualanBarang: dataResponse.pendapatanLab.barang,
      penjualanJasa: dataResponse.pendapatanLab.jasa,
      diskon: 0,
      omset:
        dataResponse.pendapatanLab.barang + dataResponse.pendapatanLab.jasa,
    },
  ];

  try {
    const existingDocRef = await checkExistingDocument(
      String(yesterdayDate.year),
      yesterdayDate.month,
      cabang
    );

    let docRef;
    if (existingDocRef) {
      docRef = existingDocRef;
    } else {
      docRef = doc(collection(db, "dates"));
      await setDoc(docRef, dataOmset);
    }

    for (const penjualan of penjualanHarian) {
      const subDocRef = doc(collection(docRef, "penjualanHarian"));
      await setDoc(subDocRef, penjualan);
    }

    await fetch(`http://localhost:${port}/pendapatan/update/lab`);

    res.status(200).json({ message: "Data successfully saved." });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Error saving data" });
  }
};

export const insertPendapatanGigi = async (req, res) => {
  const cabang = "Klinik Rawat Inap Kosasih Urip (Gigi)";
  const port = 5000;
  const response = await fetch(`http://localhost:${port}/pendapatan/cek`);
  const dataResponse = await response.json();

  const yesterdayDate = getYesterday();
  const tanggalInterval = getMonthStartEndTimestamps(
    yesterdayDate.year,
    yesterdayDate.month
  );

  const timestampTanggalMulai = Timestamp.fromMillis(
    tanggalInterval.tanggalMulai
  );
  const timestampTanggalBerakhir = Timestamp.fromMillis(
    tanggalInterval.tanggalBerakhir
  );
  const timestampTimestampt = Timestamp.fromMillis(yesterdayDate.timestamp);
  const refPerusahaan = doc(db, "Perusahaan", "42c0276C84e8chpCogKK");
  const refCabang = doc(db, "CabangPerusahaan", "5ZyEspshfwTuFooWjDf1");

  const dataOmset = {
    cabang: cabang,
    refPerusahaan: refPerusahaan,
    refCabang: refCabang,
    bulan: yesterdayDate.month,
    tahun: String(yesterdayDate.year),
    tanggalMulai: timestampTanggalMulai,
    tanggalBerakhir: timestampTanggalBerakhir,
    timestampt: timestampTimestampt,
    targetOmset: null,
    totalBarang: null,
    totalJasa: null,
    totalDiskon: 0,
    totalOmset: null,
  };

  const penjualanHarian = [
    {
      cabang: cabang,
      refPerusahaan: refPerusahaan,
      refCabang: refCabang,
      dariTanggal: timestampTimestampt,
      sampaiTanggal: timestampTimestampt,
      timestamp: timestampTimestampt,
      penjualanBarang: dataResponse.pendapatanGigi.barang,
      penjualanJasa: dataResponse.pendapatanGigi.jasa,
      diskon: 0,
      omset:
        dataResponse.pendapatanGigi.barang + dataResponse.pendapatanGigi.jasa,
    },
  ];

  try {
    const existingDocRef = await checkExistingDocument(
      String(yesterdayDate.year),
      yesterdayDate.month,
      cabang
    );

    let docRef;
    if (existingDocRef) {
      docRef = existingDocRef;
    } else {
      docRef = doc(collection(db, "dates"));
      await setDoc(docRef, dataOmset);
    }

    for (const penjualan of penjualanHarian) {
      const subDocRef = doc(collection(docRef, "penjualanHarian"));
      await setDoc(subDocRef, penjualan);
    }

    await fetch(`http://localhost:${port}/pendapatan/update/gigi`);

    res.status(200).json({ message: "Data successfully saved." });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Error saving data" });
  }
};

export const updatePendapatanKlinik = async (req, res) => {
  const cabang = "Klinik Kosasih Rawat Inap Urip";
  const yesterdayDate = getYesterday();
  const { year, month } = yesterdayDate;

  const tanggalInterval = getMonthStartEndTimestamps(
    yesterdayDate.year,
    yesterdayDate.month
  );

  try {
    // Calculate totals from subcollection
    const { totalPenjualanBarang, totalPenjualanJasa, totalOmset, float } =
      await calculateSubcollectionTotals(String(year), month, cabang);

    // Reference to the parent document
    const docRef = await checkExistingDocument(String(year), month, cabang);
    if (!docRef) {
      throw new Error(`Document for ${cabang} in ${month}/${year} not found.`);
    }

    // Update dataOmset with calculated totals
    const timestampTanggalMulai = Timestamp.fromMillis(
      tanggalInterval.tanggalMulai
    );
    const timestampTanggalBerakhir = Timestamp.fromMillis(
      tanggalInterval.tanggalBerakhir
    );
    const timestampTimestampt = Timestamp.fromMillis(yesterdayDate.timestamp);
    const refPerusahaan = doc(db, "Perusahaan", "42c0276C84e8chpCogKK");
    const refCabang = doc(db, "CabangPerusahaan", "5ZyEspshfwTuFooWjDf1");

    const dataOmset = {
      cabang: cabang,
      refPerusahaan: refPerusahaan,
      refCabang: refCabang,
      bulan: month,
      tahun: String(year),
      tanggalMulai: timestampTanggalMulai,
      tanggalBerakhir: timestampTanggalBerakhir,
      timestampt: timestampTimestampt,
      // targetOmset: null,
      totalBarang: totalPenjualanBarang,
      totalJasa: totalPenjualanJasa,
      totalDiskon: 0,
      totalOmset: totalOmset,
      persentaseCapaian: float,
    };

    // Update the parent document
    await updateDoc(docRef, dataOmset);

    res
      .status(200)
      .json({ message: "Total pendapatan lab berhasil diupdate." });

    console.log("Berhasil update");
  } catch (error) {
    console.error("Error updating parent collection:", error);
    res.status(500).json({ error: "Error updating parent collection" });
  }
};

export const updatePendapatanLab = async (req, res) => {
  const cabang = "Laboratorium Kosasih Urip";
  const yesterdayDate = getYesterday();
  const { year, month } = yesterdayDate;

  const tanggalInterval = getMonthStartEndTimestamps(
    yesterdayDate.year,
    yesterdayDate.month
  );

  try {
    // Calculate totals from subcollection
    const { totalPenjualanBarang, totalPenjualanJasa, totalOmset } =
      await calculateSubcollectionTotals(String(year), month, cabang);

    // Reference to the parent document
    const docRef = await checkExistingDocument(String(year), month, cabang);
    if (!docRef) {
      throw new Error(`Document for ${cabang} in ${month}/${year} not found.`);
    }

    // Update dataOmset with calculated totals
    const timestampTanggalMulai = Timestamp.fromMillis(
      tanggalInterval.tanggalMulai
    );
    const timestampTanggalBerakhir = Timestamp.fromMillis(
      tanggalInterval.tanggalBerakhir
    );
    const timestampTimestampt = Timestamp.fromMillis(yesterdayDate.timestamp);
    const refPerusahaan = doc(db, "Perusahaan", "42c0276C84e8chpCogKK");
    const refCabang = doc(db, "CabangPerusahaan", "5ZyEspshfwTuFooWjDf1");

    const dataOmset = {
      cabang: cabang,
      refPerusahaan: refPerusahaan,
      refCabang: refCabang,
      bulan: month,
      tahun: String(year),
      tanggalMulai: timestampTanggalMulai,
      tanggalBerakhir: timestampTanggalBerakhir,
      timestampt: timestampTimestampt,
      targetOmset: null,
      totalBarang: totalPenjualanBarang,
      totalJasa: totalPenjualanJasa,
      totalDiskon: 0,
      totalOmset: totalOmset,
    };

    // Update the parent document
    await updateDoc(docRef, dataOmset);

    res
      .status(200)
      .json({ message: "Total pendapatan lab berhasil diupdate." });

    console.log("Berhasil update");
  } catch (error) {
    console.error("Error updating parent collection:", error);
    res.status(500).json({ error: "Error updating parent collection" });
  }
};

export const updatePendapatanGigi = async (req, res) => {
  const cabang = "Klinik Rawat Inap Kosasih Urip (Gigi)";
  const yesterdayDate = getYesterday();
  const { year, month } = yesterdayDate;

  const tanggalInterval = getMonthStartEndTimestamps(year, month);

  try {
    // Calculate totals from subcollection
    const { totalPenjualanBarang, totalPenjualanJasa, totalOmset } =
      await calculateSubcollectionTotals(String(year), month, cabang);

    // Reference to the parent document
    const docRef = await checkExistingDocument(String(year), month, cabang);
    if (!docRef) {
      return res.status(404).json({
        error: `Document for ${cabang} in ${month}/${year} not found.`,
      });
    }

    // Update dataOmset with calculated totals
    const timestampTanggalMulai = Timestamp.fromMillis(
      tanggalInterval.tanggalMulai
    );
    const timestampTanggalBerakhir = Timestamp.fromMillis(
      tanggalInterval.tanggalBerakhir
    );
    const timestampTimestampt = Timestamp.fromMillis(yesterdayDate.timestamp);
    const refPerusahaan = doc(db, "Perusahaan", "42c0276C84e8chpCogKK");
    const refCabang = doc(db, "CabangPerusahaan", "5ZyEspshfwTuFooWjDf1");

    const dataOmset = {
      cabang: cabang,
      refPerusahaan: refPerusahaan,
      refCabang: refCabang,
      bulan: month,
      tahun: String(year),
      tanggalMulai: timestampTanggalMulai,
      tanggalBerakhir: timestampTanggalBerakhir,
      timestampt: timestampTimestampt,
      targetOmset: null,
      totalBarang: totalPenjualanBarang,
      totalJasa: totalPenjualanJasa,
      totalDiskon: 0,
      totalOmset: totalOmset,
    };

    // Update the parent document
    await updateDoc(docRef, dataOmset);

    res.status(200).json({ message: "Memperbarui data omset berhasil." });

    console.log("Berhasil update");
  } catch (error) {
    console.log("Error updating parent collection:", error);
    res.status(500).json({ error: "Error updating parent collection" });
  }
};

// function
export const checkExistingDocument = async (year, month, cabang) => {
  const q = query(
    collection(db, "dates"),
    where("tahun", "==", year),
    where("bulan", "==", month),
    where("cabang", "==", cabang)
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].ref;
  } else {
    return null;
  }
};

export const checkExistingDocument2 = async (year, month, cabang) => {
  const q = query(
    collection(db, "dates"),
    where("tahun", "==", year),
    where("bulan", "==", month),
    where("cabang", "==", cabang)
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return {
      ref: querySnapshot.docs[0].ref,
      data: querySnapshot.docs[0].data(),
    };
  } else {
    return null;
  }
};

const calculateSubcollectionTotals = async (year, month, cabang) => {
  try {
    const docRef = await checkExistingDocument2(year, month, cabang);

    const targetOmset = docRef.data.targetOmset;

    if (!docRef) {
      throw new Error(`Document for ${cabang} in ${month}/${year} not found.`);
    }

    // Get all documents from subcollection "penjualanHarian"
    const querySnapshot = await getDocs(
      collection(docRef.ref, "penjualanHarian")
    );
    let totalPenjualanBarang = 0;
    let totalPenjualanJasa = 0;
    let totalOmset = 0;

    // Calculate totals
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalPenjualanBarang += data.penjualanBarang || 0;
      totalPenjualanJasa += data.penjualanJasa || 0;
      totalOmset += data.omset || 0;
    });

    let totalPersen = 0;
    console.log("Target Omset = ", targetOmset);
    console.log("Total Omset = ", totalOmset);

    if (targetOmset > 0) {
      totalPersen = (parseFloat(totalOmset) / targetOmset) * 100;
    } else {
      totalPersen = 0;
    }

    console.log("total Persen= ", parseFloat(totalPersen));

    const float = parseFloat(totalPersen);

    return {
      totalPenjualanBarang,
      totalPenjualanJasa,
      totalOmset,
      float,
    };
  } catch (error) {
    console.error("Error calculating subcollection totals:", error);
    throw error;
  }
};
