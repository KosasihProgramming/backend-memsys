// Import library
import express from "express";
import cors from "cors";
// Import Route
import HomeRoute from "./src/routes/HomeRoute.js";
import CashFlowRoute from "./src/routes/CashFlowRoute.js";
import AcountRoute from "./src/routes/AcountRoute.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(HomeRoute);
app.use(CashFlowRoute);
app.use(AcountRoute);

app.listen(port, () => {
  console.log(`Jalan uy di port: ${port}`);
});
