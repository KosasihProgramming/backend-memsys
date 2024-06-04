// Import library
import express from "express";
import cors from "cors";
// Import Route
import HomeRoute from "./src/routes/HomeRoute.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(HomeRoute);

app.listen(port, () => {
  console.log(`Jalan uy di port: ${port}`);
});
