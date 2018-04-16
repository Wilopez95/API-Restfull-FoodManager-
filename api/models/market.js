const mongoose = require('mongoose');

const marketSchema = mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,
     user: {type: mongoose.Schema.Types.ObjectId , ref: 'User' ,required: true},
     name: {type: String, required: true},
     location: {type: String, required: true},
     phone: {type: Number, required: true},
});

module.exports = mongoose.model('Market',marketSchema);