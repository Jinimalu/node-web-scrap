const express = require("express");
const router = express.Router();
const nodeService = require("./node-functions");

module.exports = app => {
    app.get("/", nodeService.welcome);
    app.post("/scrap",  nodeService.scrapWebsite);
    app.get("/scrap",  nodeService.getScrapedWebsite);

}