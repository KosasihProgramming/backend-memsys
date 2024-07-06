export const getYesterday = () => {
  const today = new Date();
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const yesterdayTimestamp = today.getTime() - millisecondsInADay;
  const yesterdayDate = new Date(yesterdayTimestamp);

  const year = yesterdayDate.getFullYear();
  const monthIndex = yesterdayDate.getMonth(); // bulan di JavaScript dimulai dari 0
  const date = yesterdayDate.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[monthIndex];

  return {
    year: year,
    month: month,
    date: date,
    timestamp: yesterdayTimestamp,
  };
};

export const getMonthStartEndTimestamps = (year, monthString) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthIndex = monthNames.indexOf(monthString);

  if (monthIndex === -1) {
    throw new Error("Invalid month name");
  }

  const startDate = new Date(year, monthIndex, 1);
  const startTimestamp = startDate.getTime();

  const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
  const endTimestamp = endDate.getTime();

  return {
    tanggalMulai: startTimestamp,
    tanggalBerakhir: endTimestamp,
  };
};

export const cabangKlinik = (data) => {
  const outputs = [];
  const namaKlinik = data.namaKlinik;

  // Memeriksa dan menambahkan output untuk Klinik jika ada
  if (data.pendapatanKlinik) {
    outputs.push(`${namaKlinik} (Klinik)`);
  }

  // Memeriksa dan menambahkan output untuk Lab jika ada
  if (data.pendapatanLab) {
    outputs.push(`${namaKlinik} (Lab)`);
  }

  // Memeriksa dan menambahkan output untuk Gigi jika ada
  if (data.pendapatanGigi) {
    outputs.push(`${namaKlinik} (Gigi)`);
  }

  return outputs;
};
