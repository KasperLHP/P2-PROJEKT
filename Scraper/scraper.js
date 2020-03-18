const puppeteer = require('puppeteer');

async function scraperProduct(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/flight-list/div/flight-card[1]/div/div/div[3]/flight-price/div/span[2]');
    const txt = await el.getProperty('textContent');
    const price = await txt.jsonValue();

    const [el2] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/flight-list/div/flight-card[1]/div/div/div[1]/div/flight-info/div[1]/span[2]');
    const txt2 = await el2.getProperty('textContent');
    const FromCity = await txt2.jsonValue();

    const [el3] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/flight-list/div/flight-card[1]/div/div/div[1]/div/flight-info/div[3]/span[2]');
    const txt3 = await el3.getProperty('textContent');
    const ToCity = await txt3.jsonValue();

    console.log(price, FromCity, ToCity);

    browser.close();
}
/*Test*/
scraperProduct('https://www.ryanair.com/dk/da/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut=2020-04-16&dateIn=2020-04-23&originIata=CPH&destinationIata=STN&isConnectedFlight=false&isReturn=true&discount=0&tpAdults=1&tpTeens=0&tpChildren=0&tpInfants=0&tpStartDate=2020-04-16&tpEndDate=2020-04-23&tpOriginIata=CPH&tpDestinationIata=STN&tpIsConnectedFlight=false&tpIsReturn=true&tpDiscount=0');


/* const puppeteer = require('puppeteer');

(async() => {
    
    let flighturl = 'https://www.ryanair.com/dk/da/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut=2020-04-17&dateIn=2020-04-24&originIata=CPH&destinationIata=STN&isConnectedFlight=false&isReturn=true&discount=0&tpAdults=1&tpTeens=0&tpChildren=0&tpInfants=0&tpStartDate=2020-04-17&tpEndDate=2020-04-24&tpOriginIata=CPH&tpDestinationIata=STN&tpIsConnectedFlight=false&tpIsReturn=true&tpDiscount=0';
    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    await page.goto(flighturl, {waitUntil: 'networkidle2'});

    let data = await page.evaluate(() => {
        let price = document.querySelector('body > flights-root > div > div > div > div > flights-summary-container > flights-summary > div > div.ng-tns-c22-6 > journey-container > journey > div > div.header__carousel.ng-trigger.ng-trigger-flightCardAnimate > carousel-container > carousel > div > ul > li:nth-child(3) > carousel-item > button > div.date-item__price.h2.date-item__price--selected.ng-star-inserted > ry-price > span.price__integers.carousel-date-price--selected').innerText;
        let FromCity = document.querySelector('body > flights-root > div > div > div > div > flights-summary-container > flights-summary > div > div.ng-tns-c22-6 > journey-container > journey > flight-list > div > flight-card.flight.ng-tns-c29-19.ng-trigger.ng-trigger-flightCardAnimate.ng-tns-c26-8.card--hover-enabled.ng-star-inserted > div > div > div.card-info > div > flight-info > div:nth-child(1) > span.time__city.b2').innerText;
        let ToCity = document.querySelector('body > flights-root > div > div > div > div > flights-summary-container > flights-summary > div > div.ng-tns-c22-6 > journey-container > journey > flight-list > div > flight-card.flight.ng-tns-c29-19.ng-trigger.ng-trigger-flightCardAnimate.ng-tns-c26-8.card--hover-enabled.ng-star-inserted > div > div > div.card-info > div > flight-info > div:nth-child(3) > span.time__city.b2').innerText;
    
        return{
            price,
            FromCity,
            ToCity
        }
    });

    console.log(data);

    debugger;

    await browser.close();

})(); */

