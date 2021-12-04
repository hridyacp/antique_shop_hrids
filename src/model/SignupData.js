const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
mongoose.connect('mongodb://localhost:27017/Antiqueshop');
const Schema = mongoose.Schema;
var NewSignupSchema = new Schema({
    fname: String,
mobnumber: String,
designation: String,
email: String,
password: String
});
NewSignupSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

NewSignupSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
}
var SignupData = mongoose.model('signup', NewSignupSchema);
module.exports = SignupData;