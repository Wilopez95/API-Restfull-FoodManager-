const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');

const Market = require('../models/market');
router.get('/',(req, res, next)=>{
    Market.find()
    .select("_id user name location phone")
    .populate('user','email name phone')
    .exec()
    .then(docs => {
        const response ={
            count: docs.length,
            products:docs.map(doc => {
                return {
                    _id: doc._id,
                    user: doc.user,
                    name: doc.name,
                    location: doc.location,
                    phone: doc.phone,                    
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/markets'+doc._id
                    }

                }
           })
        };
            res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });

    
});

router.post('/',(req, res, next)=>{
        const market = new Market({   
            _id: new mongoose.Types.ObjectId(),
            user: req.body.userId,
            name: req.body.name,
            location: req.body.location,
            phone: req.body.phone
        });
        market
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Sucesfull',
                createdMarket: {
                        _id: result._id,
                        user: result.user,
                        name: result.name,
                        location: result.location,
                        phone: result.phone,
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/markets'+result._id
                        }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
        
    });
module.exports = router;