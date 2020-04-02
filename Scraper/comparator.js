const fs = require('fs');
const puppeteer = require('puppeteer');
const os = require('os');
const fs2 = require('fs-extra');
const schedule = require('node-schedule');

const options = {flag: 'a'};

/*function comparator(filename){

    var contents = fs.readFile(filename+'.json');
    var obj = JSON.parse(contents);

    console.log(obj);
}

comparator('testing'); */

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
jsonReader('C:/Users/KPsan/OneDrive/Skrivebord/GitHub/P2-PROJEKT/Scraper/CPHMAD2020-05-092020-05-16.json', (err, ScrapeDate) => {
    if(err){
        console.log(err);
        return;
    }
    console.log(ScrapeDate);
})



