const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const Market = require('../models/market');
const User = require('../models/user');
const Order = require('../models/order')

/*Falla en la lectura de la lsita de productos*/ 

router.get('/',(req, res, next)=>{
    Order.find()
    .select('user market products price status')
    .populate('user market products','email name phone name name brand description')
    .exec()
    .then(docs=>{
        res.status(200).json({
            count: docs.length,
            order: docs.map(doc => {
                return {
                    _id: doc._id,
                    user: doc.user,
                    market: doc.market,
                    produts: doc.produts,
                    price: doc.price,
                    date: doc.date,
                    status: doc.status,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/'+doc._id
                    }
                }                
            })

        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/',(req, res, next)=>{
        User.findById(req.body.userId) && Market.findById(req.body.marketId)
        .then(new_order =>{
            if(!new_order){
                return res.status(404).json({
                    message: "User or market not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                user: req.body.userId,
                market: req.body.marketId,
                produts: req.body.produts,
                price: req.body.price,
                status: req.body.status
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
        res.status(201).json({
            message: 'New Order was created',
            productcreate:{
                _id: result._id,
                user: result.user,
                market: result.market,
                produts: result.produts,
                price: result.price,
                status: result.status
            },
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders'+result._id
            }
        });
        })
        .catch(err =>{
            res.status(500).json({
                message: 'Product or market does not exist',
                error: err
            });
        });
        
});

router.get('/:orderId',(req, res, next)=>{
    res.status(201).json({
        message: 'get orden by ID',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId',(req, res, next)=>{
    res.status(201).json({
        message: 'Delete orden by ID',
        orderId: req.params.orderId
    });
});

module.exports = router;