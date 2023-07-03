const express = require("express");
const router = express.Router();
// var upload = multer({ dest: 'app/images/temp/' });
const multer = require('multer');
const path = require("path");
const nodeService = require("./node-functions");
const DIR = path.join(__dirname, '/images/temp');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let uploadImg = multer({
    storage: storage
});
module.exports = app => {
    app.get("/", nodeService.welcome);
    app.post("/scrap",  nodeService.scrapWebsite);
    app.get("/scrap",  nodeService.getScrapedWebsite);
    app.post("/upload", uploadImg.single('image'), nodeService.uploadFile);
}