const express = require("express");
const next = require("next");
const connectDb = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const showRoutes = require("./routes/index.js");

connectDb();
app
  .prepare()
  .then(() => {
    const server = express();
    server.use(cors());
    server.use(express.json({ extended: true }));
    server.use("/api/users", showRoutes());
    let origin = "*";
    server.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type,Accept,Key,Access-Control-Allow-Headers,Cache-Control,Authorization"
      );
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on ${PORT}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
