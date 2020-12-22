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
      // $(".result-title").each((index, element) => console.log($(element).text()));
      // $(".result-title").each((index, element) => console.log($(element).attr("href")));

      // const results = $(".result-title").map((index, element) => {
      //    const title = $(element).text();
      //    const url = $(element).attr("href");
      //    return { title, url };
      // }).get();

      const results = $(".result-info").map((index, element) => {
         const titleElement = $(element).find(".result-title");
         const dateElement = $(element).find(".result-date");
         const hoodElement = $(element).find(".result-hood");

         const title = $(titleElement).text();
         const url = $(titleElement).attr("href");

         const town = $(hoodElement).text()
            .trim() // remove space in front of town
            .replace("(", "")
            .replace(")", "");

         const datePosted = new Date($(dateElement).attr("datetime"));

         return { title, url, town, datePosted };
      }).get();


      console.log(results);
      await browser.close();
   } catch (e) {
      console.log(e);
      await browser.close();
   } finally {
      //console.log(results);
      //if (browser) { await browser.close(); }
   }

   // if (browser && browser.process() != null) {
   //    browser.process().kill('SIGINT');
   // }

}

main();