const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,
     user: {type: mongoose.Schema.Types.ObjectId , ref: 'User' ,required: true},
     market:  {type: mongoose.Schema.Types.ObjectId , ref: 'Market' ,required: true},
     products: {type: String,required: true},
     address: {type: String,required: true},
     price: {type: Number,default: 0,required: true},
     date: { type: Date, default: Date.now },
     remark: {type: String,default: "Pendiente"},
     status: {type: String,required: true}
     
});

module.exports = mongoose.model('Order',orderSchema);