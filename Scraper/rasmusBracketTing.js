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


// var dataArray = [];
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