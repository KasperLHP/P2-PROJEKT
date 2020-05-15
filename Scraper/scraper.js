const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); 
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
require('./passport-config1')(passport);
const mongoose = require('mongoose');
var User = require('./user-models');

const puppeteer = require('puppeteer');
const os = require('os');
const fs2 = require('fs-extra');
const schedule = require('node-schedule');
const fs = require('fs');
const options = {flag: 'a'};
const nStatic = require('node-static');
const qs = require('querystring');
const path = require('path');

//Reqs for PriceNotifier
require('dotenv').config({path: '../twilio.env'});
const twilio = require('twilio');
var twilioSID = process.env.TWILIO_ACCOUNT_SID;
var twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
console.log({twilioID: twilioSID, twilioToken: twilioAuthToken});
const client = new twilio(twilioSID, twilioAuthToken);

// Money converter
var fx = require("money");
fx.base = "DKK";
fx.rates = {DKK: 1.00000, EUR: 0.13404, USD: 0.14477, GBP: 0.11724};

var d = new Date();
let firstLine = [];

app.listen(8080);
app.set('views', path.join(__dirname, '../Webside'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

//tells our application that we can access our login details inside our req inside post
app.use(express.static("../Webside"))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
 
app.use(passport.initialize())
//store variables across all pages
app.use(passport.session())
app.use(methodOverride('_method'))
      
app.get('/', checkAuthenticated, (req, res) => {
    res.render('website.html')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.html')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.html')
})

app.post('/register', checkNotAuthenticated, (req, res) => {
    
    //const hashedPassword = bcrypt.hash(req.body.password, 10)
    newUser = new User ({
        name: req.body.navn,
        email: req.body.email,
        phone_number: req.body.phone_number,
        password: req.body.password,
        files: [('hej')]
        })
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  console.log(newUser)
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
})
})

app.get('/getFlightData', checkAuthenticated, (req, res) => {
    var directoryPath = path.join(__dirname, '../Webside/scrapedata');
    fs.readdir(directoryPath, function (err, files) {
        if (err) return console.log('Unable to scan directory: ' + err);

        User.findOne({email: "kasper@densaj.com"}, function (err, User) {
            if (err) return done(err);
            files.forEach(file => {
                for(i = 0; i < User.files.length; i++){
                    if(User.files[i] == file){
                        var Matchedfiles = User.files[i];
                        console.log(Matchedfiles);
                    }    
                }
            });
        });
    res.writeHead(200);
    res.end(JSON.stringify(files));
   }); 
});

app.post('/', checkAuthenticated, (req, res) => {
   if(req.body.datepicker !== ""){
       // Oneway
       if(req.body.datepicker3 == ""){
           startJob(req, req.body.datepicker2, undefined, req.body.myInput3, req.body.myInput4, req.body.adltsQ1, req.body.theHiddenPrice1);
           console.log({departDate: req.body.datepicker2, fromCity: req.body.myInput3, toCity: req.body.myInput4, AmountAdults: req.body.adltsQ1, UserTel1: req.body.theHiddenTel1, UserPrice1: req.body.theHiddenPrice1});
           res.writeHead(200);
       // Round trip
       }else{
           startJob(req, req.body.datepicker, req.body.datepicker1, req.body.myInput1, req.body.myInput2, req.body.adltsQ, req.body.theHiddenPrice);
           console.log({departDate: req.body.datepicker, returnDate: req.body.datepicker1, fromCity: req.body.myInput1, toCity: req.body.myInput2, AmountAdults: req.body.adltsQ, UserTel: req.body.theHiddenTel, UserPrice:req.body.theHiddenPrice});
           res.writeHead(200);
       }
   }
})

function save_scrapedata_to_user(req, filename) {
    User.findOne({email: req.user.email}, function (err, User) {
        if (err) return done(err);
        // Create the new field if it doesn't exist yet
        User.files || (User.files = []);
        User.files.push(filename);
        console.log('Filename has been added to user-profile');
        User.save();
    });
}

// logout funktion, noget passport gør for os
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

// tjekker for om man er logget ind ved hvert kald
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return   res.redirect('/')
    }
    next()
}

async function writeToFile(file, text){
    await fs2.outputFile(file, `${text}${os.EOL}`, options);
}

// Actual scraper - takes Xpath elements of website
async function scraperProduct(url, filename, adltsQ, datein){
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
    var Currency = await txt12.jsonValue();
    // Price element - price times amount of people
    var Departureprice = (Price * adltsQ);
    
    if(Currency == "€"){
        var ConvertedPriceDep = (fx.convert(Departureprice, {from: "EUR", to: "DKK"}, fx.rates)).toFixed(2);
        if(datein == "_0"){
            var Currency = "DKK";
        }
    }else if(Currency == "£"){
        var ConvertedPriceDep = (fx.convert(Departureprice, {from: "GBP", to: "DKK"}, fx.rates)).toFixed(2);
        if(datein == "_0"){
            var Currency = "DKK";
        }
    }else if(Currency == "Dkr"){
        var ConvertedPriceDep = (fx.convert(Departureprice, {from: "DKK", to: "DKK"}, fx.rates)).toFixed(2);
        if(datein == "_0"){
            var Currency = "DKK";
        }
    }else if(Currency == "$"){
        var ConvertedPriceDep = (fx.convert(Departureprice, {from: "USD", to: "DKK"}, fx.rates)).toFixed(2);
        if(datein == "_0"){
            var Currency = "DKK";
        }
    }

    var data = {ScrapeDate: Date().toLocaleString(), TotalPrice: parseFloat(ConvertedPriceDep) + ' ' + Currency, Departure: FromTo.trim(), DepartureDate: DepartureDate + ' ' + d.getFullYear(), Price: parseFloat(ConvertedPriceDep) + ' ' + Currency, DepartureTime: DepartureTime.trim(), ArrivalTime: ArrivalTime.trim(), Quantity: adltsQ, Currency: Currency};
    
    if(datein !== "_0"){
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
        // Price element and amount of people
        let Returnprice = (Price2 * adltsQ);

        if(Currency == "€"){
            var ConvertedPriceRet = (fx.convert(Returnprice, {from: "EUR", to: "DKK"}, fx.rates)).toFixed(2);
            var Currency = "DKK";
        }else if(Currency == "£"){
            var ConvertedPriceRet = (fx.convert(Returnprice, {from: "GBP", to: "DKK"}, fx.rates)).toFixed(2);
            var Currency = "DKK";
        }else if(Currency == "Dkr"){
            var ConvertedPriceRet = (fx.convert(Returnprice, {from: "DKK", to: "DKK"}, fx.rates)).toFixed(2);
            var Currency = "DKK";
        }else if(Currency == "$"){
            var ConvertedPriceRet = (fx.convert(Returnprice, {from: "USD", to: "DKK"}, fx.rates)).toFixed(2);
            var Currency = "DKK";
        }
       
        var data = {ScrapeDate: Date().toLocaleString(), TotalPrice: (parseFloat(ConvertedPriceRet) + parseFloat(ConvertedPriceDep)).toFixed(2) + ' ' + Currency, Departure: FromTo.trim(), DepartureDate: DepartureDate + ' ' + d.getFullYear(), Price: parseFloat(ConvertedPriceDep) + ' ' + Currency, DepartureTime: DepartureTime.trim(), ArrivalTime: ArrivalTime.trim(), Return: FromTo2.trim(), ReturnDate: ReturnDate.slice(3, 10) + ' ' +  d.getFullYear(), Price2: parseFloat(ConvertedPriceRet) + ' ' + Currency, DepartureTime2: DepartureTime2.trim(), ArrivalTime2: ArrivalTime2.trim(), Quantity: adltsQ, Currency: Currency};
    }
    
    var filejsonData = [];
    try{
        var filedata = fs.readFileSync("../Webside/scrapedata/"+filename+'.json', 'utf8', 'r' )
        filejsonData = JSON.parse(filedata)
        filejsonData.push(data);
    }catch(error) {
        console.log(error);
        filejsonData = data
    } 

   // filejsonData = JSON.parse(filejsonData);
    
    var jsonData = JSON.stringify(filejsonData);

    fs.writeFile("../Webside/scrapedata/"+filename+'.json', jsonData, function(err){
        if(err){
            console.log(err);
        }
    });
    console.log('Data has been added to file!');
}

// Function that inserts dates and IATA codes in the flexible link creator
function chooseRoute(dateout, datein, cityFrom, cityTo, adltsQ, JobID){
    if(datein == "_0"){
        scraperProduct('https://www.ryanair.com/dk/da/trip/flights/select?adults='+adltsQ+'&teens=0&children=0&infants=0&dateOut='+dateout+'&dateIn=&originIata='+cityFrom+'&destinationIata='+cityTo+'&isConnectedFlight=false&isReturn=false&discount=0', cityFrom + cityTo + dateout + datein + '_' + JobID, adltsQ, datein);
    }else if(datein !== "_0"){
        scraperProduct('https://www.ryanair.com/dk/da/trip/flights/select?adults='+adltsQ+'&teens=0&children=0&infants=0&dateOut='+dateout+'&dateIn='+datein+'&originIata='+cityFrom+'&destinationIata='+cityTo+'&isConnectedFlight=false&isReturn=true&discount=0', cityFrom + cityTo + dateout + datein + '_' + JobID, adltsQ, datein);
    }
}

// Function that allows us to run scraper at scheduled times + creates new file if a file doesnt already exist
function startJob(req, dateout, datein, cityFrom, cityTo, adltsQ, CustomerSpecifiedPrice, CustomerTel){
    console.log('Checking if the given file exists...');
    
    JobID = Date.now().toString();

    if(datein == undefined || false){
        datein = "_0";
    }

    cityFrom = CityToIata(cityFrom);
    cityTo = CityToIata(cityTo);
    
    firstLine.push(true);

    fs.access("../Webside/scrapedata/" + cityFrom + cityTo + dateout + datein + '_' + JobID + ".json", (err) => {
        if(!err){
            console.log('File named: ' + cityFrom + cityTo + dateout + datein + '_' + JobID + ' already exists!');
            return;
        }else{
            console.log('The file does not exist... making a new file named: ' + cityFrom + cityTo + dateout + datein + '_' + JobID);
            fs.writeFile("../Webside/scrapedata/"+cityFrom + cityTo + dateout + datein + '_' + JobID + '.json','[]', function(err){
                if(err){
                    console.log(err);
                }
            });
        }
    });    
    
    save_scrapedata_to_user(req, cityFrom + cityTo + dateout + datein + '_' + JobID + '.json');

    var j = schedule.scheduleJob('05 * * * * *', function(){
        console.log('Running scheduled job...');
        chooseRoute(dateout, datein, cityFrom, cityTo, adltsQ, JobID);
        
        if(CustomerSpecifiedPrice != 0 || undefined || "" || null){
            setTimeout(function (){
                RunPriceCheck(dateout, datein, cityFrom, cityTo, adltsQ, CustomerSpecifiedPrice, CustomerTel, JobID);
            }, 15000);
        }
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

function jsonReader(filePath, cb){
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
}

function PriceCheck(dateout, datein, cityFrom, cityTo, adltsQ, CustomerSpecifiedPrice, CustomerTel, JobID){
    jsonReader("../Webside/scrapedata/" + cityFrom + cityTo + dateout + datein + '_' + JobID + '.json', (err, ScrapedData) => {
      if(err){
          console.log(err);
          return;
      }else{
          for(i = ScrapedData.length - 1; i < ScrapedData.length; i++){
              console.log("Looking at: " + ScrapedData[i].ScrapeDate);
              // If user picks a return trip - will take the total price
              if(datein !== "_0"){
                  if(parseFloat(ScrapedData[i].TotalPrice) <= CustomerSpecifiedPrice){
                      console.log('Price equal to or lower than '+ CustomerSpecifiedPrice + ' has been recorded at: ' + ScrapedData[i].ScrapeDate);
                      console.log('Sending notification to user...');
                      client.messages.create({
                          to: '+45'+CustomerTel,
                          from: '+12512200734',
                          body: 'HeyHo!\n\nThe route: ' + ScrapedData[i].Departure + ' and ' + ScrapedData[i].Return + ' from ' + ScrapedData[i].DepartureDate + ' to ' + ScrapedData[i].ReturnDate + ' has price dropped to ' + ScrapedData[i].TotalPrice + ', which is under or equal to your desired price at ' + CustomerSpecifiedPrice + ' ' + ScrapedData[i].Currency + '.\n\nAct fast and buy before it gets sold out!\n\nVisit this link to buy: https://www.ryanair.com/dk/da/trip/flights/select?adults='+adltsQ+'&teens=0&children=0&infants=0&dateOut='+dateout+'&'+'dateIn='+datein+'&originIata='+cityFrom+'&destinationIata='+cityTo+'&isConnectedFlight=false&isReturn=true&discount=0'  
                      });
                      console.log('Notification sent!');
                  }else{
                      console.log('(round-trip) No price changes so far...');
                  }
              
              // If user picks a one-way flight - will take the price for the one way flight
              }else if(datein == "_0"){
                  if(parseFloat(ScrapedData[i].TotalPrice) <= CustomerSpecifiedPrice){
                      console.log('Price equal to or lower than '+ CustomerSpecifiedPrice + ' has been recorded at: ' + ScrapedData[i].ScrapeDate);
                      console.log('Sending notification to user...');
                      client.messages.create({
                          to: '+45'+CustomerTel,
                          from: '+12512200734',
                          body: 'HeyHo!\n\nThe route: ' + ScrapedData[i].Departure + ' on the ' + ScrapedData[i].DepartureDate + ' has price dropped to ' + ScrapedData[i].TotalPrice + ', which is under or equal to your desired price at ' + CustomerSpecifiedPrice + ' ' + ScrapedData[i].Currency + '.\n\nAct fast and buy before it gets sold out!\n\nVisit this link to buy: https://www.ryanair.com/dk/da/trip/flights/select?adults='+adltsQ+'&teens=0&children=0&infants=0&dateOut='+dateout+'&'+'dateIn=&originIata='+cityFrom+'&destinationIata='+cityTo+'&isConnectedFlight=false&isReturn=false&discount=0'  
                      });
                      console.log('Notification sent!');
                  }else{
                      console.log('(one-way) No price changes so far...');
                  }
              }
          }
      } 
  });
}

function RunPriceCheck(dateout, datein, cityFrom, cityTo, adltsQ, CustomerSpecifiedPrice, CustomerTel, JobID){
    console.log('Running scheduled price comparison...');
    console.log('Looking at route: ' + cityFrom + ' to ' + cityTo);
    console.log('User desires a totalprice of: ' + CustomerSpecifiedPrice);
    PriceCheck(dateout, datein, cityFrom, cityTo, adltsQ, CustomerSpecifiedPrice, CustomerTel, JobID);
}

function CompareJobsWithUserJob (){
    var files = fs.readdirSync('../Webside/scrapedata');

}