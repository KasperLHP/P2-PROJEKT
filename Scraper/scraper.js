const puppeteer = require('puppeteer');
const fs = require('fs');

const os = require('os');
const fs2 = require('fs-extra');
const options = {flag: 'a'};

async function writeToFile(file, text) {
  await fs2.outputFile(file, `${text}${os.EOL}`, options);
}

async function scraperProduct(url, filename){
    console.log('Starting...');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitFor(3000);

    //Departure flight
    //Price
    const [el1] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/div/div[2]/carousel-container/carousel/div/ul/li[3]/carousel-item/button/div[2]/ry-price/span[2]');
    const txt = await el1.getProperty('textContent');
    const Price = await txt.jsonValue();
    //From city, to city
    const [el2] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/div/div[1]/h3/text()');
    const txt2 = await el2.getProperty('textContent');
    const FromTo = await txt2.jsonValue();
    //Departure date
    const [el3] = await page.$x('/html/body/flights-root/div/div/flights-trip-details-container/flights-trip-details/div/div[2]/text()[2]');
    const txt3 = await el3.getProperty('textContent');
    const DepartureDate = await txt3.jsonValue();
    //Departure time
    const [el4] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/flight-list/div/flight-card[3]/div/div/div[1]/div/flight-info/div[1]/span[1]');
    const txt4 = await el4.getProperty('textContent');
    const DepartureTime = await txt4.jsonValue();
    //Arrival time
    const [el5] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/flight-list/div/flight-card[3]/div/div/div[1]/div/flight-info/div[3]/span[1]');
    const txt5 = await el5.getProperty('textContent');
    const ArrivalTime = await txt5.jsonValue();
    
    
    //Return flight
    //Price
    const [el6] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[2]/journey-container/journey/div/div[2]/carousel-container/carousel/div/ul/li[3]/carousel-item/button/div[2]/ry-price/span[2]');
    const txt6 = await el6.getProperty('textContent');
    const Price2 = await txt6.jsonValue();
    //From city, to city
    const [el7] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[2]/journey-container/journey/div/div[1]/h3/text()');
    const txt7 = await el7.getProperty('textContent');
    const FromTo2 = await txt7.jsonValue();
    //Return date
    const [el8] = await page.$x('/html/body/flights-root/div/div/flights-trip-details-container/flights-trip-details/div/div[2]/span[2]');
    const txt8 = await el8.getProperty('textContent');
    const ReturnDate = await txt8.jsonValue();
    //Departure time
    const [el9] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[2]/journey-container/journey/flight-list/div/flight-card[1]/div/div/div[1]/div/flight-info/div[1]/span[1]');
    const txt9 = await el9.getProperty('textContent');
    const DepartureTime2 = await txt9.jsonValue();
    //Arrival time
    const [el10] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[2]/journey-container/journey/flight-list/div/flight-card[1]/div/div/div[1]/div/flight-info/div[3]/span[1]');
    const txt10 = await el10.getProperty('textContent');
    const ArrivalTime2 = await txt10.jsonValue();

    var data = [{ScrapeDate: Date().toLocaleString()}, {Departure: FromTo, DepartureDate: DepartureDate + " 2020", Price: Price + "DKK", DepartureTime: DepartureTime, ArrivalTime: ArrivalTime}, {Return: FromTo2, ReturnDate: ReturnDate.slice(3, 10) + " 2020", Price: Price2 + "DKK", DepartureTime: DepartureTime2, ArrivalTime: ArrivalTime2}, {TotalPrice: parseFloat(Price) + parseFloat(Price2) + " DKK"}];
    var jsonData = JSON.stringify(data);
    
    writeToFile(filename+'.json', jsonData);
    
/*
fs.appendFile(filename+'.json', jsonData (err) => {
        if(err){
            console.log('The "data to append" was appended to file!');
        }
      });

*/
    /* fs.writeFile("test2.json", jsonData, function(err){
        if(err){
            console.log(err);
        }
    }); */
    
    

    console.log('File made!');
}   

function chooseDate(dateout, datein){
    scraperProduct('https://www.ryanair.com/dk/da/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut='+dateout+'&'+'dateIn='+datein+'&originIata=CPH&destinationIata=STN&isConnectedFlight=false&isReturn=true&discount=0', dateout + datein);

    console.log('Før fil er lavet');
    
    /*fs.writeFile(dateout + datein +'.json',null, function(err){
        if(err){
            console.log(err);
        }
    });*/
    
    console.log('Efter fil er lavet');
}

chooseDate('2020-05-17', '2020-05-24');
