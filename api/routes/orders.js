const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const Product = require('../models/product');
const Market = require('../models/market');
const User = require('../models/user');
const Order = require('../models/order')

/*Falla en la lectura de la lsita de productos*/ 

router.get('/',(req, res, next)=>{
    Order.find()
    .select('user market products address price date remark status')
    .populate('user','email name phone ')
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
                    address: doc.address,
                    price: doc.price,
                    date: doc.date,
                    remark: doc.remark,
                    status: doc.status,
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

router.post('/',checkAuth,(req, res, next)=>{
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
                products: req.body.products,
                address: req.body.address,
                price: req.body.price,
                remark: req.body.remark,
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
                address: result.address,
                price: result.price,
                remark: result.remark,
                status: result.status
            },
        });
        })
        .catch(err =>{
            res.status(500).json({
                message: 'Product or market does not exist',
                error: err
            });
        });
        
});

//ordenes de un markey
router.get('/market/:marketId',checkAuth,(req, res, next)=>{
    const marketId = req.params.marketId;
    Order.find({market:marketId}).sort({date: "desc"})
    .select('user market products address price date remark status')
    .populate('user','email name phone ')
    .exec()
    .then(order=>{
        if(order.length<0){
            return res.status(404).json({
                message: "This market has no orders"
            })
        }
        res.status(200).json({
            orders: order,
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
})


//ordenes de un user
router.get('/user/:userId',checkAuth,(req, res, next)=>{
    const userId = req.params.userId;
    Order.find({user:userId}).sort({date: "desc"})
    .select('user market products address price date remark status')
    .populate('user','email name phone ')
    .exec()
    .then(order=>{
        if(order.length<0){
            return res.status(404).json({
                message: "This client has no orders"
            })
        }
        res.status(200).json({
            orders: order,
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId',(req, res, next)=>{
    res.status(201).json({
        message: 'Delete orden by ID',
        orderId: req.params.orderId
    });
});

module.exports = router;

router.patch('/:orderId',(req, res, next)=> {
    const id = req.params.orderId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }
    Order.update({ _id: id },{ $set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Sucesfull'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
           error: err 
        });    
    }); 
});