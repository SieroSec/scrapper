const request = require("request-promise");
// const request = require("request-promise").defaults({
//    proxy: '127.0.0.1:8080'
// });
const cheerio = require("cheerio");
const fs = require('fs');
const { exit } = require("process");

// async function scrapeJobHeader() {
//    try {
//       const htmlResult = await request.get(url);
//       const $ = await cheerio.load(htmlResult);

//       $(".result-info").each((index, element) => {
//          const resultTitle = $(element).children(".result-title");
//          const title = resultTitle.text();
//          const url = resultTitle.attr("href");
//          const datePosted = new Date(
//             $(element)
//                .children("time")
//                .attr("datetime")
//          );
//          const hood = $(element)
//             .find(".result-hood")
//             .text();
//          const scrapeResult = { title, url, datePosted, hood };
//          scrapeResults.push(scrapeResult);
//       });
//       return scrapeResults;
//    } catch (err) {
//       console.error(err);
//    }
// }

async function sleep(miliseconds) {
   return new Promise(resolve => setTimeout(resolve, miliseconds));
}

async function scrapeDescription(jobsWithHeaders) {
   return await Promise.all(
      jobsWithHeaders.map(async job => {
         try {
            const htmlResult = await request.get(job.url);
            const $ = await cheerio.load(htmlResult);
            $(".print-qrcode-container").remove();
            job.description = $("#postingbody").text();
            job.address = $("div.mapaddress").text();
            const compensationText = $(".attrgroup")
               .children()
               .first()
               .text();
            job.compensation = compensationText.replace("compensation: ", "");
            return job;
         } catch (error) {
            console.error(error);
         }
      })
   );
}

// async function scrapeJoblist() {
//    const jobsWithHeaders = await scrapeJobHeader();
//    const jobsFullData = await scrapeDescription(jobsWithHeaders);
// }

// scrapeJoblist();

const scrapeResults = [];
const url = "https://www.cvonline.lt/darbo-skelbimai/informacines-technologijos/vilniaus?page=1";
const html = fs.readFileSync('./test.html');
const $ = cheerio.load(html);

// // LOAD jQuery in browser:
// var jq = document.createElement('script');
// jq.src = "https://code.jquery.com/jquery-3.3.1.min.js";  /* Include any online jquery library you need */
// document.getElementsByTagName('head')[0].appendChild(jq);

const sample = [{
   jobId: '4264846',
   jobUrl: '//www.cvonline.lt/job-ad/visma-lietuva-uab/sap-bi-developer-consultant-fE4264846.html',
   jobTitle: 'SAP BI DEVELOPER/CONSULTANT',
   jobSalary: 'Mėnesinis atlygis (bruto): Nuo 2128.00 iki 5000.00 EUR',
   jobCompany: 'Visma Lietuva, UAB',
   jobLocation: 'Giedraičių g. 3, Vilnius',
   jobDeadline: 'Prašymus siųskite iki 2020.12.28',
   jobAdDate: '07. gruodžio 2020 08:52'
}]

function main() {

   $("div#joblist>.cvpage-module.cvo_module_offers>.cvo_module_offers_wrap>.cvo_module_offer>.cvo_module_offer_content>.cvo_module_offer_box.offer_content>.offer_primary>.offer_primary_info").each((index, element) => {
      const jobId = $(element).find(".offer-primary-meta.clearfix>div.offer_save_feature").attr("id").replace("save", "");
      const jobUrl = $(element).find("h2>a:not(.newJobsLink)").attr("href");
      const jobTitle = $(element).find("h2>a:not(.newJobsLink)").text();
      const jobSalary = $(element).find(".offer-primary-meta.clearfix>ul.cvo_module_offer_salary>li:last-child>span").text();
      const jobCompany = $(element).find(".offer-primary-meta.clearfix>ul.cvo_module_offer_meta>li.offer-company>span[itemprop='hiringOrganization']>a").text();
      const jobLocation = $(element).find(".offer-primary-meta.clearfix>ul.cvo_module_offer_meta>li.offer-location>span[itemprop='jobLocation']>a").text();
      const jobDeadline = $(element).find(".offer-primary-meta.clearfix>ul.cvo_module_offer_meta.offer_dates>li:last").text();
      const jobAdDateTxt = $(element).find(".offer-primary-meta.clearfix>ul.cvo_module_offer_meta.offer_dates>li:first").attr("title");
      const jobAdDateNum = $(element).find(".offer-primary-meta.clearfix>ul.cvo_module_offer_meta.offer_dates>li>span[itemprop='datePosted']").attr("content");

      const jobOffer = { jobId, jobUrl, jobTitle, jobSalary, jobCompany, jobLocation, jobDeadline, jobAdDateTxt, jobAdDateNum }
      scrapeResults.push(jobOffer);


      // console.log(jobOffer);
      // sleep(2000);

      // const title = resultTitle.text();
      // const url = resultTitle.attr("href");
      // const datePosted = new Date(
      //    $(element)
      //       .children("time")
      //       .attr("datetime")
      // );
      // const hood = $(element)
      //    .find(".result-hood")
      //    .text();
      // const scrapeResult = { title, url, datePosted, hood };
      // scrapeResults.push(scrapeResult);
   });
   console.log(scrapeResults);
}

main();