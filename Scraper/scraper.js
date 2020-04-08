const puppeteer = require('puppeteer');
const os = require('os');
const fs2 = require('fs-extra');
const schedule = require('node-schedule');
const fs = require('fs');
const options = {flag: 'a'};
var nStatic = require('node-static');
var qs = require('querystring');
var http = require('http');
let firstLine = [];

var fileServer = new nStatic.Server('../Webside');

http.createServer(function (req, res) {
    if(req.method == 'POST') {
        console.log(req.method);
        var body = '';

        req.on('data', function(data){
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function(){
            var post = qs.parse(body);
            startJob(selected_date_element.textContent, selected_date_element2.textContent, post.myInput1, post.myInput2);
           
            console.log({CityFrom: post.myInput1, CityTo: post.myInput2});
            res.writeHead(200);
            res.end('test');
            console.log(post);
            // use post['blah'], etc.
        });
    }else
        fileServer.serve(req, res);
}).listen(8080);

async function writeToFile(file, text){
  await fs2.outputFile(file, `${text}${os.EOL}`, options);
}

/*function jsonReader(filePath, cb){
    fs.readFile(filePath, (err, fileData) => {
        if (err){
            return cb && cb(err)
        }
        try{
            const object = JSON.parse(fileData);
            return cb && cb(null, object)
        }catch(err){
            return cb && cb(err)
        }
    })
}*/

// Actual scraper - takes Xpath elements of website
async function scraperProduct(url, filename){
    console.log('Starting scraper...');
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    console.log('Fetching data...');

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
    const [el4] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/flight-list/div/flight-card/div/div/div[1]/div/flight-info/div[1]/span[1]');
    const txt4 = await el4.getProperty('textContent');
    const DepartureTime = await txt4.jsonValue();
    //Arrival time
    const [el5] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/flight-list/div/flight-card/div/div/div[1]/div/flight-info/div[3]/span[1]');
    const txt5 = await el5.getProperty('textContent');
    const ArrivalTime = await txt5.jsonValue();
    //Currency
    const [el12] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/div/div[2]/carousel-container/carousel/div/ul/li[3]/carousel-item/button/div[2]/ry-price/span[1]');
    const txt12 = await el12.getProperty('textContent');
    const Currency = await txt12.jsonValue();
    // Price element + currency element (euro, pounds, etc..)
    let Departureprice = Price + Currency;
    
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
    //Currency 
    const [el11] = await page.$x('/html/body/flights-root/div/div/div/div/flights-summary-container/flights-summary/div/div[2]/journey-container/journey/div/div[2]/carousel-container/carousel/div/ul/li[3]/carousel-item/button/div[2]/ry-price/span[1]');
    const txt11 = await el11.getProperty('textContent');
    const Currency2 = await txt11.jsonValue();
    // Price element + currency element (euro, pounds, etc..)
    let Returnprice = Price2 + Currency2;

    // var dataArray = [];
    var data = {ScrapeDate: Date().toLocaleString(), TotalPrice: (parseFloat(Price) + parseFloat(Price2)) + ' ' + Currency, Departure: FromTo, DepartureDate: DepartureDate + " 2020", Price: Departureprice , DepartureTime: DepartureTime, ArrivalTime: ArrivalTime, Return: FromTo2, ReturnDate: ReturnDate.slice(3, 10) + " 2020", Price2: Returnprice, DepartureTime2: DepartureTime2, ArrivalTime2: ArrivalTime2};
    var jsonData = JSON.stringify(data);
    // emptyArray.push(jsonData);
   
    /*
    jsonReader(filename+'.json', (err, ScrapedData) => {
        if(err){
            console.log(err);
            return;
        }else{
            for(i = 0; i < ScrapedData.length; i++){
                emptyArray.push(ScrapedData[i]);
                console.log(ScrapedData[i].TotalPrice);
            }
        }
    });
    
    fs.writeFile(filename+'.json', jsonData, function (err) {
        if (err) throw err;
        console.log('Writing to file...');
    });
    
    for(i = 0; i < emptyArray.length; i++) {
        console.log(emptyArray[i]);
    } */

    console.log('Adding data to file...');

    if(firstLine[firstLine.length -1] == false){
        writeToFile(filename+'.json', ',' + jsonData);
        }else{
        writeToFile(filename+'.json', jsonData);
    }
    
    firstLine[firstLine.length - 1] = false;
    console.log('Data has been added to file!');
}

// Function that inserts dates and IATA codes in the flexible link creator
function chooseRoute(dateout, datein, cityFrom, cityTo){
    scraperProduct('https://www.ryanair.com/dk/da/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut='+dateout+'&'+'dateIn='+datein+'&originIata='+cityFrom+'&destinationIata='+cityTo+'&isConnectedFlight=false&isReturn=true&discount=0', cityFrom + cityTo + dateout + datein);
}

// Function that allows us to run scraper at scheduled times + creates new file if a file doesnt already exist
function startJob(dateout, datein, cityFrom, cityTo){
    console.log('Checking if the given file exists...');
    
    cityFrom = CityToIata(cityFrom);
    cityTo = CityToIata(cityTo);
    
    //firstLine.push(true);

    fs.access(cityFrom + cityTo + dateout + datein +".json", (err) => {
        if(!err){
            console.log('File named: ' + cityFrom + cityTo + dateout + datein + ' already exists!');
            return;
        }else{
            console.log('The file does not exist... making a new file named: ' + cityFrom + cityTo + dateout + datein);
            fs.writeFile(cityFrom + cityTo + dateout + datein +'.json','[\n', function(err){
                if(err){
                    console.log(err);
                }
            });
        }
    });    

    var j = schedule.scheduleJob('05 * * * * *', function(){
        console.log('Running scheduled job...');
        chooseRoute(dateout, datein, cityFrom, cityTo);
    });
}

function CityToIata(city){
    switch(city){
        case 'London Heathrow':
            return 'LHR';
            break;
        case 'Paris Charles de Gaulle':
            return 'CDG';
            break;
        case 'Frankfurt':
            return 'FRA';
            break;
        case 'Amsterdam':
            return 'AMS';
            break;
        case 'Istanbul':
            return 'IST';
            break;
        case 'Madrid':
            return 'MAD';
            break;
        case 'Munich':
            return 	'MUC';
            break;
        case 'Rome Leonardo da Vinci–Fiumicino':
            return 'FCO';
            break;
        case 'London Gatwick':
            return 'LGW';
            break;
        case 'Barcelona':
            return 'BCN';
            break;
        case 'Moscow':
            return 'DME';
            break;
        case 'Khimki':
            return 'SVO';
            break;
        case 'Paris Orly':
            return 'ORY';
            break;
        case 'Antalya':
            return 'AYT';
            break;
        case 'Zurich':
            return 'ZRH';
            break;
        case 'Copenhagen':
            return 'CPH';
            break;
        case 'Oslo':
            return 'OSL';
            break;
        case 'Mallorca':
            return 'PMI';
            break;
        case 'Vienna':
            return 'VIE';
            break;
        case 'Dusseldorf':
            return 'DUS';
            break;
        case 'Manchester':
            return 'MAN';
            break;
        case 'Stockholm':
            return 'ARN';
            break;
        case 'Dublin':
            return 'DUB';
            break;
        case 'Berlin Tegel':
            return 'TXL';
            break;
        case 'Brussels':
            return 	'BRU';
            break;
        case 'Sabiha Gokcen':
            return 'SAW';
            break;
        case 'Milan Malpensa':
            return 'MXP';
            break;
        case 'London Stansted':
            return 'STN';
            break;
        case 'Lisbon':
            return 'LIS';
            break;
        case 'Helsinki':
            return 'HEL';
            break;
        case 'Geneva':
            return 'GVA';
            break;
        case 'Hamburg':
            return 'HAM';
            break;
        case 'Malaga':
            return 'AGP';
            break;
        case 'St. Petersburg':
            return 'LED';
            break;
        case 'Athens':
            return 'ATH';
            break;
        case 'Nice':
            return 'NCE';
            break;
        case 'Vnukovo':
            return 'VKO';
            break;
        case 'Prague':
            return 'PRG';
            break;
        case 'Ankara':
            return 'ESB';
            break;
        case 'Warsaw':
            return 'WAW';
            break;
        case 'Izmir':
            return 'ADB';
            break;
        case 'Edinburgh':
            return 'EDI';
            break;
        case 'Gran Canaria' || 'Las Palmas':
            return 'LPA';
            break;    
        case 'London Luton':
            return 'LTN';
            break;          
        case 'Alicante':
            return 'ALC';
            break;
        case 'Stuttgart':
            return 'STR';
            break;
        case 'Birgmingham':
            return 'BHX';
            break;
        case 'Cologne' || 'Cologne Bonn':
            return 'CGN';
            break;
        case 'Milan Linate':
            return 'LIN';
            break;
        case 'Milan Il Caravaggio':
            return 'BGY';
            break;
        case 'Tenerife':
            return 'TFS';
            break;
        case 'Lyon':
            return 'LYS';
            break;
        case 'Budapest':
            return 'BUD';
            break;
        case 'Venice':
            return 'VCE';
            break;
        case 'Marseille':
            return 'MRS';
            break;
        case 'Boryspil':
            return 'KBP';
            break;
        case 'Bucharest':
            return 'OTP';
            break;
        case 'Toulouse':
            return 'TLS';
            break;
        case 'Glasgow':
            return 'GLA';
            break;
        case 'Brussels South Charleroi':
            return 'CRL';
            break;
        case 'Berlin Schönefeld':
            return 'SXF';
            break;
        case 'Catania' || 'Catania-Fontanarossa':
            return 'CTA';
            break;
        case 'Porto':
            return 'OPO';
            break;
        case 'Bergen':
            return 'BGO';
            break;
        case 'Bologna':
            return 'BLQ';
            break;
        case 'Bristol':
            return 'BRS';
            break;     
        case '	Faro':
            return 'FAO';
            break;
        case 'Basel':
            return 'BSL';
            break;
        case 'Heraklion':
            return 'HER';
            break;        
        case 'Ibiza':
            return 'IBZ';
            break; 
        case 'Naples':
            return 'NAP';
            break;
        case 'Lanzaroten':
            return 'ACE';
            break;
        case 'Hannover ':
            return 'HAJ';
            break;
        case 'Göteborg':
            return 'GOT';
            break;
        case 'Larnaca':
            return 'LCA';
            break;
        case 'Riga':
            return 'RIX';
            break;      
        case 'Rome Ciampino–G. B. Pastine ':
            return 'CIA';
            break; 
        case 'Stavanger':
            return 'SVG';
            break; 
        case 'Valencia':
            return 'VLC';
            break; 
        case 'Bordeaux':
            return 'BOD';
            break;
        case 'Pisa':
            return 'PSA';
            break;
        case 'Newcastle':
            return 'NCL';
            break; 
        case 'Palermo ':
            return 'PMO';
            break;
        case 'East Midlands':
            return 'EMA';
            break;     
        case 'Adana':
            return 'ADA';
            break; 
        case 'Trondheim':
            return 'TRD';
            break;
        case 'Yekaterinburg':
            return 'SVX';
            break;  
        case 'Fuerteventura':
            return 'FUE';
            break;
        case 'Rhodese':
            return 'RHO';
            break;
        case 'Liverpool':
            return 'LPL';
            break; 
        case 'Thessaloniki ':
            return 'SKG';
            break;
        case 'Dalaman':
            return 'DLM';
            break;
        case 'Malta':
            return 'MLA';
            break;
        case 'Belfast ':
            return 'BFS';
            break;
        case 'Beauvais–Tillé ':
            return 'BVA';
            break;
        case 'Nantes':
            return 'NTE';
            break;     
        case 'Bilbao':
            return 'BIO';
            break; 
        case 'Novosibirsk':
            return 'OVB';
            break;
        case 'Seville':
            return 'SVQ';
            break;
        case 'Kraków':
            return 'KRK';
            break;                            
    }
}

// console.log(selected_date_element.textContent, selected_date_element2.textContent, CityToIata(document.getElementById('myInput1')), CityToIata(document.getElementById('myInput2')));
// startJob('2020-05-09', '2020-05-16', 'London Stansted', 'Copenhagen');
// selected_date_element.textContent - dateout
// selected_date_element2.textContent - datein
// CityToIata(document.getElementById('myInput1')) - cityfrom
// CityToIata(document.getElementById('myInput2')) - city to