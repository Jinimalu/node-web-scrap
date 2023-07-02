var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var scraperSchema = new Schema(
    {
        
        websiteUrl: {
            type: String,
        },
        name: {
            type: String,
        },
        logo: {
            type: String,
        },
        paletts: {
            type: Array,
        },
        typography: {
            type: Array,
        },
        description: {
            type: String,
        },
        webkeywords: {
            type: Array,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    {
        collection: "scraper",
        versionKey: false,
        timestamps: true,
        toObject: {
            virtuals: true,
        },
        toJSON: {
            virtuals: true,
        },
    }
);
module.exports = mongoose.model("scraper", scraperSchema);