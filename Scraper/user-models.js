
const mongoose = require('mongoose')
var Schema = mongoose.Schema
const db = mongoose.connection
var mongoDB = 'mongodb+srv://dbJohn:123@dbb2-7fmcy.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true})
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conncted to Mongoose'))

var userSchema = new Schema({
    name: {
        type: String,
        required: true
      },
    email: {
        type: String,
        required: true
      },
    phone_number: {
        type: Number,
        required: true
      },
    password: {
        type: String,
        required: true
      },
    files: [{
      type: String,
      required: true
  }]
});

var User = mongoose.model('User', userSchema)

module.exports = User

