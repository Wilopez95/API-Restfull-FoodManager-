const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,
     name: {type: String, required: true},
     brand: {type: String, required: true},
     description: {type: String, required: true},
     category: {type: String, required: true},
     code: {type: Number, required: true}
     
});

module.exports = mongoose.model('Product',productSchema);