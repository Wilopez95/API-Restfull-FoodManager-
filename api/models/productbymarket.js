const mongoose = require('mongoose');

const productbymarketSchema = mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,
     product: {type: mongoose.Schema.Types.ObjectId , ref: 'Product' ,required: true},
     market: {type: mongoose.Schema.Types.ObjectId , ref: 'Market' ,required: true},
     quantity: {type: Number, required: true},
     price: {type: Number, required: true}
     
});

module.exports = mongoose.model('Productbymarket',productbymarketSchema);