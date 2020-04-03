const fs = require('fs');
const twilio = require('twilio');

/*
client.messages.create({
    to: 'YOUR_NUMBER',
    from: 'YOUR_TWILIO_NUMBER',
    body: 'Hello from Twilio!'
  });

var client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
client.sendMessage({to: '+004542313187', from: '+16082862799', body: 'Hey fuckhovede, din flybillet er nu på den laveste pris!'});
*/

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
                }else{
                    console.log('No price changes so far...');
                }
            }
        } 
    });
}

PriceCheck('2020-05-08', '2020-05-15', 'CPH', 'STN', 250);




/* function insertEndingBracket(filename){
    fs.appendFile(filename+'.json', '\n ]', function (err) {
        if (err) throw err;
        console.log('Ending bracket inserted!');
      });
} */

// insertEndingBracket('OPOSTN2020-05-082020-05-15');