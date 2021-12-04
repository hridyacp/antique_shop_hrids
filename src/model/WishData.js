const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/Antiqueshop');
const Schema = mongoose.Schema;
var WishSchema = new Schema({
   name:String,
    type:String,
   price:String,
  user:String,
  email:String,
    image:String,
    qty:String,
    prodID:String
});
var WishData = mongoose.model('wishdataitem', WishSchema);
module.exports = WishData;