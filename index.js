const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const cors = require("cors");

const port = 8000;
const app = express();
const { authRoutes } = require("./routes");

db.sequelize.sync({ alter: false, force: false });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.listen(port, () => console.log(`Listening on PORT ${port}`));