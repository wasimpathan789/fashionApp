const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
// app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
// const api = "http://localhost:3030";

app.use(`/api/categories`, categoriesRoutes);
app.use(`/api/products`, productsRoutes);
app.use(`/api/users`, usersRoutes);
app.use(`/api/orders`, ordersRoutes);

// const MONGO = "mongodb://127.0.0.1:27017/fashionBazar";
const MONGO = "mongodb://127.0.0.1:27017/eCommerce";

//Database
// db connection 
mongoose
  .connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log("Db not Connected"));

// Server
app.listen(3030, () => {
  console.log("server is listening 3030");
});

// process.on("unhandledRejection", (err) => {
//   console.log(`ERROR: ${err.message}`);
//   console.log("shutting down");
//   server.close(() => {
//     process.exit(1);
//   });
// });
