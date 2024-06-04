export const getIndex = (req, res) => {
  try {
    const response = {
      nama: "API Memsys",
      deskripsi: "Backend API untuk Memsys kosasih",
    };
    res.status(200).json({
      status: "success",
      data: response,
      message: "Berhasil",
    });
  } catch (error) {
    console.error("Galat: ", error.message);
    res.status(500).json({
      status: "error",
      message: "Galat 404",
      error: error.message,
    });
  }
};
