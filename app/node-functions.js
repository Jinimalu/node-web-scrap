
const https = require("https");
const StatusCodes = require('http-status-codes');
const { failure, success } = require("./responseHelper");
const Meta = require('html-metadata-parser');
const keyword_extractor = require("keyword-extractor");
const cheerio = require('cheerio');
const webScrap = require('./schema/scraperSchema');
const path = require('path');
const fs = require('fs');
const getColors = require('get-image-colors');

const welcome = (req, res) => {
    return res.status(StatusCodes.StatusCodes.OK).send(success("success", "Welcome", StatusCodes.StatusCodes.OK, {}));
}
const scrapWebsite = async(req, res) => {
    try {
        var result = await Meta.parser(req.body.websiteUrl);

        let message="Inserted successfully";
        
        let data;
        let colors = [];
        if(result) {
            if(result.og.image)  {
                // get the colors from the image
                await getColors(result.og.image).then(colorsRes => {
                    colors = colorsRes.map(color => color.hex());
                });
                
            }
            const extraction_result = result.meta.description ? 
            keyword_extractor.extract(result.meta.description,{language:"english",
                remove_digits: true,
                return_changed_case:true,
                remove_duplicates: false
            }):"";
            data = {
                websiteUrl:result.og.url ? result.og.url : "",
                name:result.og.title ? result.og.site_name :"",
                logo:result.og.image ? result.og.image : "",
                description:result.meta.description ? result.meta.description : "",
                webkeywords:extraction_result,
                paletts:colors,


            }
            await webScrap.findOneAndUpdate(
                {isDeleted : false},
                data,
                {
                    upsert: true,
                }
            ).catch((error) => {
                return res.status(StatusCodes.StatusCodes.BAD_REQUEST).send(failure(error));
            })
        }
        return res.status(StatusCodes.StatusCodes.OK).send(success(message, data, StatusCodes.StatusCodes.OK, {}));
    } catch (error) {
        return res.status(StatusCodes.StatusCodes.BAD_REQUEST).send(failure(error));
    }
}
const getScrapedWebsite = async(req,res) => {
    try { 
        const respose = await webScrap.findOne().select('websiteUrl name description logo paletts typography webkeywords').limit(1);
        return res.status(StatusCodes.StatusCodes.OK).send(success("Data", respose, StatusCodes.StatusCodes.OK, {}));

    } catch (error) {
        return res.status(StatusCodes.StatusCodes.BAD_REQUEST).send(failure(error));     
    }
}

const uploadFile = async(request, res) => {
    let fileName = request.file.filename.split(' ').join('_');
    let fileUrl = path.join(__dirname, './images/temp', fileName);
    //save to db
    await webScrap.updateOne(
        {isDeleted : false,
        _id:request.body.id},
        {logo:fileUrl},
        {
            upsert: true,
        }
    ).catch((error) => {
        return res.status(StatusCodes.StatusCodes.BAD_REQUEST).send(failure(error));
    })

    return res.status(StatusCodes.StatusCodes.OK).send(success("success", fileUrl, StatusCodes.StatusCodes.OK, {}));

}
module.exports = {
    welcome,
    scrapWebsite,
    getScrapedWebsite,
    uploadFile
};