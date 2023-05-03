const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;
const app = express();
const { authRoutes, productRoutes } = require("./routes");

db.sequelize.sync({ alter: false, force: false });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.listen(port, () => console.log(`Listening on PORT ${port}`));