const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const fs = require("fs");

const Listing = require("./model/Listing.js");

async function connectToMongoDb() {
   await mongoose.connect("mongodb://localhost:27017/scraper", { useNewUrlParser: true });
   console.log("CONNECTED to mongodb.");
}

async function disconnectToMongoDb() {
   await mongoose.disconnect();;
   console.log("DISCONNECTED from mongodb.");
}


async function scrapeListings(pageObj) {
   try {
      // const browser = await puppeteer.launch({ headless: true, userDataDir: './data', });
      // const page = await browser.newPage();
      const url = "https://zurich.craigslist.org/search/jjj"
      await pageObj.goto(url);
      //await page.screenshot({ path: 'screenshot.png' });

      const html = await pageObj.content();
      const $ = cheerio.load(html);

      const listings = $(".result-info").map((index, element) => {
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

      //console.log(results);
      //await browser.close();
      return listings;
   } catch (e) {
      console.log(e);
      //await browser.close();
   } finally {
      //console.log(results);
   }
}

async function scrapeJobDescriptions(listings, page) {
   //for (var i = 0; i < listings.length; i++) {
   for (var i = 0; i < 5; i++) {
      await page.goto(listings[i].url);
      const html = await page.content();
      const $ = cheerio.load(html);
      const jobDescription = $("#postingbody").text();
      listings[i].jobDescription = jobDescription;

      const compensation = $("p.attrgroup > span").text();
      listings[i].compensation = compensation.replace("Vergütung:", "; Vergütung:");

      // console.log(listings[i].jobDescription);
      // console.log(listings[i].compensation);

      const listingModel = new Listing(listings[i]);
      await listingModel.save();

      await sleep(1000);
   }
   return listings
}

async function sleep(miliseconds) {
   return new Promise(resolve => setTimeout(resolve, miliseconds));
}


async function main(url) {
   //const page = "https://zurich.craigslist.org/search/jjj";
   try {
      connectToMongoDb();
      const browser = await puppeteer.launch({ headless: true, userDataDir: './data', });
      const page = await browser.newPage();

      const listings = await scrapeListings(page);
      //console.log(listings);

      const listingsWithJobDescriptions = await scrapeJobDescriptions(listings, page);


      console.log(listingsWithJobDescriptions);
      await browser.close();
      disconnectToMongoDb();
   } catch (e) {
      console.log(e);
      await browser.close();
   }
}

main();