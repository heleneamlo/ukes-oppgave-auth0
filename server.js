const express = require("express");
const { join } = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
//bruk forskjellige ting, morgan for logging og helmet for https headers fra express apper
app.use(morgan("dev"));
app.use(helmet());
//gjør sånn at public folderen blir public
app.use(express.static(join(__dirname, "public")));
//få auth config
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});
//send index fil
app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
//hvis den får SIGINT skal den stoppe
process.on("SIGINT", function() {
  process.exit();
});

module.exports = app;
