const express = require("express");
const compression = require('compression');
var bodyParser = require("body-parser");
const http = require("http");
var cors = require('cors')
const nodeService = require("./app/node-functions");


//initializing app..
const app = express();
// app.use(compression());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());
require("./app/database");

const port = 8080;


// let router = express.Router();

require('./app/router')(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
module.exports = app;