const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/Antiqueshop');
const Schema = mongoose.Schema;
var CartSchema = new Schema({
   name:String,
    type:String,
   price:String,
  user:String,
  email:String,
    image:String,
    prodID:String, 
    qty:String  
});
var CartData = mongoose.model('cartdataitem', CartSchema);
module.exports = CartData;