var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title : String,
    description : String,
    date : {type: Date , default : Date.now},
    email : String
});


module.exports = mongoose.model('Post', postSchema);