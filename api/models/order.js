const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,
     user: {type: mongoose.Schema.Types.ObjectId , ref: 'User' ,required: true},
     market:  {type: mongoose.Schema.Types.ObjectId , ref: 'Market' ,required: true},
     products: {type: mongoose.Schema.Types.Array,ref: 'Product',required: true},
     price: {type: Number,default: 0,required: true},
     date: { type: Date, default: Date.now },
     status: {type: String,required: true}
     
});

module.exports = mongoose.model('Order',orderSchema);