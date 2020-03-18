const puppeteer = require('puppeteer');

async function scraperProduct(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    //Departure - gives price and from city to city
    //Price
    const [el] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/div/div[2]/carousel-container/carousel/div/ul/li[3]/carousel-item/button/div[2]/ry-price/span[2]');
    const txt = await el.getProperty('textContent');
    const price = await txt.jsonValue();
    //From city, to city
    const [el2] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/div/div[1]/h3/text()');
    const txt2 = await el2.getProperty('textContent');
    const FromTo = await txt2.jsonValue();
    //Departure date
    const [el3] = await page.$x('/html/body/flights-root/div/div/flights-trip-details-container/flights-trip-details/div/div[2]/text()[2]');
    const txt3 = await el3.getProperty('textContent');
    const DepartureDate = await txt3.jsonValue();

    //Return - gives price and from city to city
    //Price
    const [el4] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[2]/journey-container/journey/div/div[2]/carousel-container/carousel/div/ul/li[3]/carousel-item/button/div[2]/ry-price/span[2]');
    const txt4 = await el4.getProperty('textContent');
    const price2 = await txt4.jsonValue();
    //From city, to city
    const [el5] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[2]/journey-container/journey/div/div[1]/h3/text()');
    const txt5 = await el5.getProperty('textContent');
    const FromTo2 = await txt5.jsonValue();
    //Return date
    const [el6] = await page.$x('/html/body/flights-root/div/div/flights-trip-details-container/flights-trip-details/div/div[2]/span[2]');
    const txt6 = await el6.getProperty('textContent');
    const ReturnDate = await txt6.jsonValue();

    console.log({Departure: FromTo, DepartureDate: DepartureDate + " 2020", Price: price}, {Return: FromTo2, ReturnDate: ReturnDate.slice(3, 10) + " 2020", Price: price2}, {ScrapeDate: Date().toLocaleString()});
    browser.close();
}

scraperProduct('https://www.ryanair.com/dk/da/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut=2020-04-16&dateIn=2020-04-23&originIata=CPH&destinationIata=STN&isConnectedFlight=false&isReturn=true&discount=0&tpAdults=1&tpTeens=0&tpChildren=0&tpInfants=0&tpStartDate=2020-04-16&tpEndDate=2020-04-23&tpOriginIata=CPH&tpDestinationIata=STN&tpIsConnectedFlight=false&tpIsReturn=true&tpDiscount=0');
