const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/Antiqueshop');
const Schema = mongoose.Schema;
var AntiqueSchema = new Schema({
   name:String,
    type:String,
    description:String,
    price:String,
    image:String,
    prodID:String  
});
var AntiqueData = mongoose.model('antiqdataitem', AntiqueSchema);
module.exports = AntiqueData;
