const fs = require('fs');
const twilio = require('twilio');

// Find your account sid and auth token in your Twilio account Console.
var client = new twilio('AC047d2382d93c940c915d16976326c659', '01b0ac5994bb30dabd7ef3b778d338a5');

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

function PriceCheck(dateout, datein, cityFrom, cityTo, CustomerSpecifiedPrice){
      jsonReader(cityFrom + cityTo + dateout + datein + '.json', (err, ScrapedData) => {
        if(err){
            console.log(err);
            return;
        }else{
            for(i = 0; i < ScrapedData.length; i++){
                if(parseFloat(ScrapedData[i].TotalPrice) <= CustomerSpecifiedPrice){
                    console.log(ScrapedData[i].ScrapeDate);
                    console.log('Sending notification about price drop...');
                    client.messages.create({
                        to: '+4542313187',
                        from: '+12512200734',
                        body: 'HeyHo! The route' + cityFrom + 'to' + cityTo + '(From' + dateout + 'to' + datein + ')' + 'is now at or lower than the price' + '(' +CustomerSpecifiedPrice + ')' + 'you have specified!'
                      });
                }else{
                    console.log('No price changes so far...');
                }
            }
        } 
    });
}

PriceCheck('2020-05-08', '2020-05-15', 'CPH', 'STN', 250);