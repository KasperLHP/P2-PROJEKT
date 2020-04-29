require('dotenv').config();
const fs = require('fs');
const twilio = require('twilio');
var twilioSID = process.env.TWILIO_ACCOUNT_SID;
var twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(twilioSID, twilioAuthToken);

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

function PriceCheck(dateout, datein, cityFrom, cityTo, CustomerSpecifiedPrice, IsReturn){
      jsonReader(cityFrom + cityTo + dateout + datein + '.json', (err, ScrapedData) => {
        if(err){
            console.log(err);
            return;
        }else{
            for(i = 0; i < ScrapedData.length; i++){
                // If user picks a return trip - will take the total price
                if(IsReturn == 'true'){
                    if(parseFloat(ScrapedData[i].TotalPrice) <= CustomerSpecifiedPrice){
                        console.log('Price equal to or lower than '+ CustomerSpecifiedPrice + ' has been recorded at: ' + ScrapedData[i].ScrapeDate);
                        console.log('Sending notification to user...');
                        client.messages.create({
                            to: '+4542313187',
                            from: '+12512200734',
                            body: 'HeyHo!\n\nThe route: ' + ScrapedData[i].Departure + ' and ' + ScrapedData[i].Return + ' from ' + ScrapedData[i].DepartureDate + ' to ' + ScrapedData[i].ReturnDate + ' has price dropped to ' + ScrapedData[i].TotalPrice + ', which is under or equal to your desired price at ' + CustomerSpecifiedPrice + ' ' + ScrapedData[i].Currency + '.\n\nAct fast and buy before it gets sold out!\n\nVisit this link to buy: https://www.ryanair.com/dk/da/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut='+dateout+'&'+'dateIn='+datein+'&originIata='+cityFrom+'&destinationIata='+cityTo+'&isConnectedFlight=false&isReturn='+ IsReturn +'&discount=0'  
                        });
                        console.log('Notification sent!');
                    }else{
                        console.log('No price changes so far...');
                    }
                
                // If user picks a one-way flight - will take the price for the one way flight
                }else if(IsReturn == 'false'){
                    if(parseFloat(ScrapedData[i].Price) <= CustomerSpecifiedPrice){
                        console.log('Price equal to or lower than '+ CustomerSpecifiedPrice + ' has been recorded at: ' + ScrapedData[i].ScrapeDate);
                        console.log('Sending notification to user...');
                        client.messages.create({
                            to: '+4542313187',
                            from: '+12512200734',
                            body: 'HeyHo!\n\nThe route: ' + ScrapedData[i].Departure + ' on the ' + ScrapedData[i].DepartureDate + ' has price dropped to ' + ScrapedData[i].Price + ', which is under or equal to your desired price at ' + CustomerSpecifiedPrice + ' ' + ScrapedData[i].Currency + '.\n\nAct fast and buy before it gets sold out!\n\nVisit this link to buy: https://www.ryanair.com/dk/da/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut='+dateout+'&'+'dateIn='+datein+'&originIata='+cityFrom+'&destinationIata='+cityTo+'&isConnectedFlight=false&isReturn='+ IsReturn +'&discount=0'  
                        });
                        console.log('Notification sent!');
                    }else{
                        console.log('No price changes so far...');
                    }
                }
            }
        } 
    });
}

PriceCheck('2020-05-10', '2020-05-17', 'CPH', 'STN', 200, 'false');