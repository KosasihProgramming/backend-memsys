// Import library
const express = require("express");
const cors = require("cors");
// Import Route
const HomeRoute = require("./src/routes/HomeRoute.js");
const AcountRoute = require("./src/routes/AcountRoute.js");
const CashFlowRoute = require("./src/routes/CashFlowRoute.js");
const AuthRoute = require("./src/routes/AuthRoute.js");
const CreateTableRoute = require("./src/routes/CreateTableRoute.js");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use(HomeRoute);
app.use(AcountRoute);
app.use(CashFlowRoute);
app.use(AuthRoute);
app.use(CreateTableRoute);

app.listen(port, () => {
  console.log(`Jalan uy di port: ${port}`);
});
