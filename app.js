const express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors')

//initializing app..
const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());
require("./app/database");

const port = 8080;

require('./app/router')(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
module.exports = app;