const fs = require('fs');

function jsonReader(filePath, cb){
    fs.readFile(filePath, (err, fileData) => {
        if (err){
            return cb && cb(err)
        }
        try{
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        }catch(err){
            return cb && cb(err)
        }
    })
}

jsonReader('C:/Users/KPsan/OneDrive/Skrivebord/GitHub/P2-PROJEKT/Scraper/CPHMAD2020-05-092020-05-16.json', (err, ScrapedData) => {
    if(err){
        console.log(err);
        return;
    }
    console.log(ScrapedData[2].ScrapeDate);
})

function readData(dateout, datein, cityFrom, cityTo){
      jsonReader('C:/Users/KPsan/OneDrive/Skrivebord/GitHub/P2-PROJEKT/Scraper/CPHMAD2020-05-092020-05-16.json', (err, ScrapedData) => {
        if(err){
            console.log(err);
            return;
        }
        console.log(ScrapedData[2].ScrapeDate);
    });
}

function insertEndingBracket(filename){
    fs.appendFile(filename+'.json', '\n ]', function (err) {
        if (err) throw err;
        console.log('Ending bracket inserted!');
      });
}


readData('2020-05-08', '2020-05-15', 'OPO', 'STN');

insertEndingBracket('OPOSTN2020-05-082020-05-15');
