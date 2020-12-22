const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

async function main() {
   const html = await request.get("https://reactnativetutorial.net/css-selectors");
   // fs.writeFileSync("./test.html", html);

   const cher = await cheerio.load(html);
   const theText = cher("h1").text();
   console.log(theText);
}


main();