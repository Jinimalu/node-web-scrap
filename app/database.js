const mongoose = require("mongoose");
const DB_USER="";
const DB_PASS="";
const DB_HOST='localhost:27017';
const DB_NAME='scraper-db'
var authentication =
  DB_USER && DB_PASS
    ? DB_USER + ":" + DB_PASS + "@"
    : "";
var connectionString = "mongodb://" + authentication + DB_HOST + "/" + DB_NAME;
console.log(connectionString);
mongoose.connect(connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);