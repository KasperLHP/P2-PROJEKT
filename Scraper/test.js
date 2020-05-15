const fs = require('fs');
var User = require('./user-models');

const UserFile = User.files;

fs.readdir('../Webside/scrapedata', (err, files) => {
    if (err) return done(err);
    User.findOne({email: "kasper@densaj.com"}, function (err, User) {
        if (err) return done(err);
        files.forEach(file => {
            for(i = 0; i < User.files.length; i++){
                if(User.files[i] == file){
                    console.log('Found match!:', file, "is in both folder scrapedata and MongoDB");
                }    
            }
        });
    });
});