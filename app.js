//Imports

const express = require("express");
const app = express();
require("express-async-errors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const cors = require("cors");

//Route Imports
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const paymentRoute = require("./routes/payment");
const config = require("./utils/config");

// const testRoute = require("./routes/test");

// const mongoUrl =
//   "mongodb+srv://admin1:UKIspgDXeRQ2BORu@cluster0.pyzpf.mongodb.net/test?retryWrites=true";

//Database Connection
mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info("DB Connection Successful!!!!");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error.message);
  });

//Middleware
app.use(express.json());
app.use(cors());

//Route Handlers
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", paymentRoute);
// app.use("/api/test", testRoute);

//Custom Middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
