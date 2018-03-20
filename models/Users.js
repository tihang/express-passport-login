const mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, minlength:6, maxlength:25, required: true},
    fname : {type: String, maxlength:15},
    lname : {type: String, maxlength:15},
    password : {type: String, minlength:6, maxlength:15, required: true},
    thumbnail : String
});

userSchema.method.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

userSchema.method.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

var User = module.exports = mongoose.model('User', userSchema);

// module.exports.createUser = (newUser, callback)=>{
//     bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//             newUser.password = hash;
//             newUser.save(callback);
//         });
//     });
// };