const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const fs = require("fs");

const scrapResults = [
   {
      title: "Miau",
      datePostes: new Date(),
      town: "(Zurich)",
      url: "http://",
      jobDescription: "",
      salary: "50000"
   }
]

//$(".result-title").each((index, element) => console.log($(element).text()))

async function main() {
   // const html = await request.get("https://reactnativetutorial.net/css-selectors");
   // // fs.writeFileSync("./test.html", html);

   // const cher = await cheerio.load(html);
   // const theText = cher("h1").text();
   // console.log(theText);
   try {
      const browser = await puppeteer.launch({ headless: true, userDataDir: './data', });
      const page = await browser.newPage();
      await page.goto("https://zurich.craigslist.org/search/jjj");
      //await page.screenshot({ path: 'screenshot.png' });

      const html = await page.content();
      const $ = cheerio.load(html);
      //$(".result-title").each((index, element) => console.log($(element).text()));
      $(".result-title").each((index, element) => console.log($(element).attr("href")));

      await browser.close();
   } catch (e) {
      console.log(e);
      await browser.close();
   } finally {
      //console.log(browser);
      //if (browser) { await browser.close(); }
   }

   // if (browser && browser.process() != null) {
   //    browser.process().kill('SIGINT');
   // }

}

main();