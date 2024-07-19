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

export const getAllPendapatanBpjs = async (req, res) => {
  const querySelectAcount = `SELECT * FROM akun_pendapatan WHERE keterangan = 'bpjs'`;

  const [akunPendapatanBpjs] = await connection.query(querySelectAcount);

  const akunBpjs = akunPendapatanBpjs[0].id_akun;

  const queryTotalPendapatanBpjs = `  
    SELECT SUM(debit - credit) AS balance
    FROM journaltrans
    WHERE approved = 1
      AND DATE(jtdate) = CURDATE()
      AND accountid = '${akunBpjs}'
      AND division IN ('0011');
  `;

  const [response] = await connection.query(queryTotalPendapatanBpjs);

  res.json({
    status: "Success",
    message: "Total pendapatan bpjs hari ini",
    data: response,
  });
};

export const insertPendapatanBpjs = async (req, res) => {
  const cabang = "Klinik Rawat Inap Sumber Waras BPJS Kesehatan";
  const port = 5000;
  const response = await fetch(`http://localhost:${port}/bpjs/cek`);
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
  const refCabang = doc(db, "CabangPerusahaan", "GB8rFXWX80N8SmbmPxM0");
  const tanggalInput = Timestamp.fromMillis(sekarang);

  const dataOmset = {
    cabang: cabang,
    refPerusahaan: refPerusahaan,
    refCabang: refCabang,
    bulan: yesterdayDate.month,
    tahun: String(yesterdayDate.year),
    tanggalMulai: timestampTanggalMulai,
    tanggalBerakhir: timestampTanggalBerakhir,
    timestampt: timestampTimestampt,
    targetOmset: 39990000,
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
      penjualanBarang: 0,
      penjualanJasa: dataResponse.data[0].balance,
      diskon: 0,
      omset: dataResponse.data[0].balance,
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

    await fetch(`http://localhost:${port}/bpjs/update`);

    res.json({ status: "Success", message: "Data successfully saved." });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Error saving data" });
  }
};

export const updatePendapatanBpjs = async (req, res) => {
  const cabang = "Klinik Rawat Inap Sumber Waras BPJS Kesehatan";
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

    console.log("test ", {
      totalPenjualanBarang,
      totalPenjualanJasa,
      totalOmset,
      float,
    });

    // Update dataOmset with calculated totals
    const timestampTanggalMulai = Timestamp.fromMillis(
      tanggalInterval.tanggalMulai
    );
    const timestampTanggalBerakhir = Timestamp.fromMillis(
      tanggalInterval.tanggalBerakhir
    );
    const timestampTimestampt = Timestamp.fromMillis(yesterdayDate.timestamp);
    const refPerusahaan = doc(db, "Perusahaan", "42c0276C84e8chpCogKK");
    const refCabang = doc(db, "CabangPerusahaan", "GB8rFXWX80N8SmbmPxM0");

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
