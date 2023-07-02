
const StatusCodes = require('http-status-codes');
const { failure, success } = require("./responseHelper");
// const { scrape } = require('website-scraper');
// const { LogoScrape } = require('logo-scrape');
const Meta = require('html-metadata-parser');
const keyword_extractor = require("keyword-extractor");
const cheerio = require('cheerio');
const nodefetch = require('node-fetch');
const webScrap = require('./schema/scraperSchema');
const path = require('path')
const getColors = require('get-image-colors')

// const got = require('got')

const welcome = (req, res) => {
    return res.status(StatusCodes.StatusCodes.OK).send(success("success", "Welcome", StatusCodes.StatusCodes.OK, {}));
}
const scrapWebsite = async(req, res) => {
    try {
        console.log(req.body);
        var result = await Meta.parser(req.body.websiteUrl);
        console.log(result,"result")
        let message="Inserted successfully";
        // getColors(result.og.url).then(colors => {
        //     // `colors` is an array of color objects
        //     console.log(colors,'colors')
        //   })
        let data;
        if(result) {
            const extraction_result = result.meta.description ? 
            keyword_extractor.extract(result.meta.description,{language:"english",
                remove_digits: true,
                return_changed_case:true,
                remove_duplicates: false
            }):"";
console.log(extraction_result,'extraction_result')
            data = {
                websiteUrl:result.og.url ? result.og.url : "",
                name:result.og.title ? result.og.site_name :"",
                logo:result.og.image ? result.og.image : "",
                description:result.meta.description ? result.meta.description : "",
                webkeywords:extraction_result,


            }
            console.log(data,"data")
            
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
const scrapWebsite1 = async(req, res) => {
    try {
        console.log(req.body);
        const url = req.body.websiteUrl;
        const response = await nodefetch(url);
        const body = await response.text();
        let $ = cheerio.load(body);

let title = $('title');
console.log(title.text());
var cssFiles = [];
if( $('html').length !== 0 ) {
    var cssLinks = $('html').find('link[rel="stylesheet"]');
    // console.log('html')
} else {
    var cssLinks = $('head').find('link[rel="stylesheet"]');
    // console.log('head')
};
for(var i=0; i<cssLinks.length; i++) {
    //check if the CSS files are a relative link or not, download the CSS
    cssFiles[i] = {};
    cssFiles[i].href =  cssLinks[i].attribs.href.toString();
    cssFiles[i].code;
};
cssFiles.forEach(function(val, index, array){
    request(array[index].href, function(err, resp, body){
        cssFiles[index].code = body;
        //calls get fonts function here
        getFonts(cssFiles[index]);
    });
});
console.log(cssFiles)
//         let data;
//         if(result) {
//             const extraction_result = result.meta.description ? 
//             keyword_extractor.extract(result.meta.description,{language:"english",
//                 remove_digits: true,
//                 return_changed_case:true,
//                 remove_duplicates: false
//             }):"";
// console.log(extraction_result,'extraction_result')
//             data = {
//                 websiteUrl:result.og.url ? result.og.url : "",
//                 name:result.og.title ? result.og.site_name :"",
//                 logo:result.og.image ? result.og.image : "",
//                 description:result.meta.description ? result.meta.description : "",
//                 webkeywords:extraction_result,


//             }
//             console.log(data,"data")
        // }
        return res.status(StatusCodes.StatusCodes.OK).send(success("success", [], StatusCodes.StatusCodes.OK, {}));
    } catch (error) {
        return res.status(StatusCodes.StatusCodes.BAD_REQUEST).send(failure(error));
    }
}
function getFonts(css){
    var str = css.code;
    var fontFace = str.match(/@font-face\s*{\s*([^]*?)(?=})/g);
    //check if there are font face references in the CSS first
    if (fontFace !== null) {
        for(var i=0; i<fontFace.length; i++) {
            //First lets make this shit an object
            var font = {};
            // finds font family reference
            var fontFam = fontFace[i].match( nameRegex );
            //makes the file name, fails when null so check if null first
            if(fontFam !== null){
                font.name = fontFam.toString().replace( nameReplace, '' ).trim();
            }
            //find file urls and don't process object if it doesn't have a name
            //to avoid issues with stuff like charset and other CSS declarations
            if(font.name) {
                //checks to see if url contains any " or ', has to use different regex if not
                if(fontFace[i].search(/url\(\s*?"\s*?|url\(\s*?'\s*?/g) !== -1) {
                    font.downloadList = fontFace[i].match( dlRegex ).toString().replace(dlReplace, '').trim().split(',');
                } else {
                    //selects font src urls without any " or '
                    font.downloadList = fontFace[i].match( /url\((?:\s*?)([\S]+.[eot|woff|ttf])(?=\s*?\))/g ).toString().replace(/url\(/, '').trim().split(',');
                }
                

                // splits download list into individual files, notes the extension, and creates a real dl URL
                for(var j=0; j<font.downloadList.length; j++) {

                    if (font.downloadList[j].indexOf('?') !== -1) {
                        font.downloadList[j] = font.downloadList[j].split('?').shift();
                    } else if (font.downloadList[j].indexOf('#') !== -1) {
                        font.downloadList[j] = font.downloadList[j].split('#').shift();
                    }

                    var filePieces = font.downloadList[j].split('.');
                    font.fileExtension = filePieces.pop();
                    font.fileName = filePieces.toString().split('/').pop();

                    var path = css.href.replace(/\/[^\/]*$/, '');
                    
                    // var wget ='wget '+ path + font.fileName+'.'+font.fileExtension + ' -O ' + dlDir +'/'+ font.name+'.'+font.fileExtension;
                    var wget ='wget "'+ path + '/' + font.downloadList[j] + '" -O "' + dlDir +'/'+ font.fileName+'.'+font.fileExtension + '"';
                    console.log(wget);
                    var child = exec(wget, function(err, stdout,stderr){
                        if (err) throw err;
                        // else console.log(font.fileName + '.' + font.fileExtension + ' saved as '+font.name+'.'+font.fileExtension);
                     });

                };
            };  
        };
    } 
}
module.exports = {
    welcome,
    scrapWebsite,
    getScrapedWebsite
};