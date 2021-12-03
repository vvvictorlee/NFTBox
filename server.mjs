import express  from "express";
import path from "path";
import history from "connect-history-api-fallback";

// // DB connection
// var MONGODB_URL = process.env.MONGODB_URL;
// var mongoose = require("mongoose");
// mongoose
//   .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     //don't show the log when it is test
//     if (process.env.NODE_ENV !== "test") {
//       console.log("Connected to %s", MONGODB_URL);
//       console.log("App is running ... \n");
//       console.log("Press CTRL + C to stop the process. \n");
//     }
//   })
//   .catch((err) => {
//     console.error("App starting error:", err.message);
//     process.exit(1);
//   });
// var db = mongoose.connection;

const app = express();
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.set("trust proxy", true); // 设置以后，req.ips是ip数组；如果未经过代理，则为[]. 若不设置，则req.ips恒为[]

// app.use(history({
//     // OPTIONAL: Includes more verbose logging
//     verbose: true
// }))
// app.use(express.bodyParser());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

// define a simple route
// app.get('/', (req, res) => {
//     res.json({"message": "."});
// });

import s from "./app/routes/api.routes.mjs" 
s(app);

const port = process.env.PORT || 8778;
app.listen(port);
console.log("Listening on port: " + port);

export default app;
