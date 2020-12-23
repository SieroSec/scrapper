const parser = require('../parser');
const fs = require('fs')
let html
let listings;

beforeAll(() => {
   html = fs.readFileSync('./test.html');
   listings = parser.listings(html);
});

// // const listings = [{
// //    date: new Date("2020-12-21"),
// //    url: "https://www.cvonline.lt/darbo-skelbimas/adb-gjensidige/.net-vyr.-programuotojas-a-draudimo-sprendimu-pletros-grupeje-it-departamente-a4271822.html",
// //    title: ".NET VYR. PROGRAMUOTOJAS (-A) DRAUDIMO SPRENDIMŲ PLĖTROS GRUPĖJE, IT DEPARTAMENTE",
// //    salary: "Mėnesinis atlygis (bruto): Nuo 2007.00 iki 3010.00 EUR",
// //    company: "ADB „Gjensidige“",
// //    town: "Vilnius",
// //    ad_date: "Prieš 10 val.",
// //    deadline: "Prašymus siųskite iki 2021.01.21",
// // }]

it("it should give correct listings object", () => {
   //const listings = parser.getListings(html);
   //expect(listings.length).toBe(7);
   expect(listings[0].title).toBe(".NET VYR. PROGRAMUOTOJAS (-A) DRAUDIMO SPRENDIMŲ PLĖTROS GRUPĖJE, IT DEPARTAMENTE");
   expect(listings[0].url).toBe("https://www.cvonline.lt/darbo-skelbimas/adb-gjensidige/.net-vyr.-programuotojas-a-draudimo-sprendimu-pletros-grupeje-it-departamente-a4271822.html");
});


