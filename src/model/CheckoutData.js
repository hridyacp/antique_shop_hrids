const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/Antiqueshop');
const Schema = mongoose.Schema;
var CheckoutSchema = new Schema({
  address:String,
  email:String,
    payment:String,
    pstatus:String
});
var CheckoutData = mongoose.model('checkoutdata', CheckoutSchema);
module.exports = CheckoutData;