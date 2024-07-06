// Import library
import express from "express";
import cors from "cors";
import cron from "node-cron";
import fetch from "node-fetch";

// Import Route
import HomeRoute from "./src/routes/HomeRoute.js";
import AcountRoute from "./src/routes/AcountRoute.js";
import CashFlowRoute from "./src/routes/CashFlowRoute.js";
import AuthRoute from "./src/routes/AuthRoute.js";
import CreateTableRoute from "./src/routes/CreateTableRoute.js";
import JournalRoute from "./src/routes/JournalRoute.js";
import HistoryCheckRoute from "./src/routes/HistoryCheckRoute.js";
import QrisCheck from "./src/routes/QrisCheckRoute.js";
import PendapatanRoute from "./src/routes/PendapatanRoute.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use(HomeRoute);
app.use(AcountRoute);
app.use(CashFlowRoute);
app.use(AuthRoute);
app.use(CreateTableRoute);
app.use(JournalRoute);
app.use(HistoryCheckRoute);
app.use(QrisCheck);
app.use(PendapatanRoute);

// Pendapatan Route setiap jam 8 pagi
cron.schedule("0 8 * * *", async () => {
  try {
    const response = await fetch(`http://localhost:${port}/pendapatan/klinik`);
    const data = await response.text();
    console.log("Response from /pendapatan/klinik:", data);
  } catch (error) {
    console.error("Error accessing /pendapatan/klinik:", error);
  }
});

cron.schedule("0 8 * * *", async () => {
  try {
    const response = await fetch(`http://localhost:${port}/pendapatan/lab`);
    const data = await response.text();
    console.log("Response from /pendapatan/klinik:", data);
  } catch (error) {
    console.error("Error accessing /pendapatan/klinik:", error);
  }
});

cron.schedule("0 8 * * *", async () => {
  try {
    const response = await fetch(`http://localhost:${port}/pendapatan/gigi`);
    const data = await response.text();
    console.log("Response from /pendapatan/klinik:", data);
  } catch (error) {
    console.error("Error accessing /pendapatan/klinik:", error);
  }
});

app.listen(port, () => {
  console.log(`Jalan uy di port: ${port}`);
});
