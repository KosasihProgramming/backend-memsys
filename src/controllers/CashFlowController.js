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

  const queryDua = `select sum(debit-credit) as balance from journaltrans where approved=1 and (date_format(jtdate,'%Y/%m/%d')<'${tanggalAkhir}') and accountid='${accountId}' and division in ('0011')`;

  try {
    const [responseCashFlow] = await connection.query(stringQuery);
    const [responseBalance] = await connection.query(queryDua);
    console.log("200 | Berhasil");
    res.json({
      status: "success",
      message: "Data Cashflwo",
      dataBalance: responseBalance[0],
      dataCachFlow: responseCashFlow,
    });
  } catch (error) {
    console.error("Error fetching cashflow: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const balanceCek = async (req, res) => {
  const { totalKas, tanggalAkhir, accountId } = req.body;

  const stringQuery = `select sum(debit-credit) as balance from journaltrans where approved=1 and (date_format(jtdate,'%Y/%m/%d')<'${tanggalAkhir}') and accountid='${accountId}' and division in ('0011')`;

  try {
    const [response] = await connection.query(stringQuery);
    const balance = response[0].balance;

    const balanceCek = (totalKas, balance) => {
      if (totalKas != balance) {
        return "Tidak balance";
      } else {
        return "Balance";
      }
    };
    console.log("200 | Berhasil");
    res.json({
      status: "Success",
      message: "Cek Balance Cash Flow",
      data: {
        keterangan: balanceCek(totalKas, balance),
        totalKas: totalKas,
        balance: balance,
      },
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
