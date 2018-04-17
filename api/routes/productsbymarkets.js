
const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');

const Productbymarket = require('../models/productbymarket');
const Product = require('../models/product');
const Market = require('../models/market');
const checkAuth = require('../middleware/check-auth');
    

router.get('/',(req, res, next)=>{
    Productbymarket.find()
    .select('product market quantity price')
    .populate('product market', 'name brand description location')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            productbymarket: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    market: doc.market,
                    quantity: doc.quantity,
                    price: doc.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/productsbymarkets'+doc._id
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

router.post('/',checkAuth,(req, res, next)=>{
    Product.findById(req.body.productId) && Market.findById(req.body.marketId)
        .then(new_product => {
            if(!new_product){
                return res.status(404).json({
                    message: 'Product or market not found'
                });
            } 
            const productbymarket = new Productbymarket({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                market: req.body.marketId,
                quantity: req.body.quantity,
                price: req.body.price
            });
            return productbymarket.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'New product',
            productcreate:{
                _id: result._id,
                product: result.product,
                market: result.market,
                quantity: result.quantity,
                price: result.price
            },
            request: {
                type: 'POST',
                url: 'http://localhost:3000/productsbymarkets'+result._id

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

router.get('/:productbymarketId',checkAuth,(req, res, next)=>{
    Productbymarket.findById(req.params.productbymarketId)
    .select('product market quantity price')
    .populate('product market', 'name brand description location')
    .exec()
    .then(productbymarket=>{
        if(!productbymarket){
            return res.status(404).json({
                message: "productbymarket not found"
            })
        }
        res.status(200).json({
            productbymarket: productbymarket,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/productsbymarkets/'+ productbymarket._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});
/*Sobre escribir una funcion 
router.get('/:marketId',(req, res, next)=>{
    Productbymarket.findById({ marketId: req.body.marketId})
    .exec()
    .then(product => {
        if(product.length<1){
            return res.status(401).json({
                message: 'The market no have any product'
            });
        }else{
            res.status(201).json({
                message: 'New product',
                productcreate:{
                    _id: result._id,
                    product: result.product,
                    market: result.market,
                    quantity: result.quantity,
                    price: result.price
                },
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/productsbymarkets'+result._id
    
                }
            });
        }
    })
});
*/
router.delete('/:productbymarketId',(req, res, next)=>{
    Productbymarket.remove({_id: req.params.productbymarketId }) 
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'ProductByOrder Deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/productsbymarkets'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;