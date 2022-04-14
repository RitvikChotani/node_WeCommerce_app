const express = require("express");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");

//Router Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/product", product);
app.use("/api/v1/user", user);
app.use("/api/v1/order", order);

module.exports = app;
