//exports.add = (n1, n2) => n1 + n2
const cheerio = require("cheerio");

// const fs = require('fs')
// const html = fs.readFileSync('./test.html');
// const listings = parser.listings(html);


exports.listings = (html) => {
   const $ = cheerio.load(html);
   const results = $(".cvo_module_offers_wrap").map((index, element) => {
      $(element).find(".cvo_module_offer")
   });
}


// select once                   selectmany
// div.cvo_module_offers_wrap > div.cvo_module_offer > 
