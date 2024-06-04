import connection from "../config/Database.js";

export const getCashflow = async (req, res) => {
  const { tanggalAwal, tanggalAkhir, accountId } = req.body;

  const stringQuery = `
    SELECT
      accountid, t1.division, t1.jtid, t1.jtdate, t1.reftransaction, t1.debit, t1.credit, t1.memo 
    FROM 
      journaltrans AS t1 
    WHERE 
      (DATE_FORMAT(t1.jtdate,'%Y/%m/%d') BETWEEN '${tanggalAwal}' AND '${tanggalAkhir}') 
      AND t1.accountid='${accountId}'  
      AND t1.division IN ('0011') 
    ORDER BY 
      t1.jtdate, 
      t1.jtid, 
      t1.debit DESC, 
      t1.credit`;

  try {
    const [response, fild] = await connection.query(stringQuery);
    console.log("200 | Berhasil");
    res.json({
      status: "success",
      message: "Data Cashflwo",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching cashflow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const queryDua = async () => {};
