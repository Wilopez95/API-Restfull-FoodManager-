
const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Product = require('../models/product');

router.get('/',(req, res, next)=> {
    Product.find()
    .select("_id name brand description category code")
    .exec()
    .then(docs => {
        const response ={
            count: docs.length,
            products:docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    brand: doc.brand,
                    description: doc.description,
                    category: doc.category,
                    code: doc.code,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'+doc._id
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

// POST de un producto con estructura
router.post('/',checkAuth,(req, res, next)=> {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        brand: req.body.brand,
        description: req.body.description,
        category: req.body.category, 
        code: req.body.code
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Sucesfull',
            createdProduct: {
                _id: result._id,
                name: result.name,
                brand: result.brand,
                description: result.description,
                category: result.category,
                code: result.code,
                request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products'+result._id
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

router.get('/:productId',(req, res, next)=> {
    const id = req.params.productId;
    Product.findById(id)
    .select("_id name brand description category code")
    .exec()
    .then(doc => {
        console.log("From data base", doc);
        
        if(doc){
            res.status(200).json({
                message: 'Sucesfull',
                createdProduct: {
                    _id: doc._id,
                        name: doc.name,
                        brand: doc.brand,
                        description: doc.description,
                        category: doc.category,
                        code: doc.code,
                        request: {
                            type: 'GET by ID',
                            url: 'http://localhost:3000/products'+doc._id
                        }
                }
            });
        }else{
            res.status(404).json({message: "Data not found"});
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({ error: err });
    });
    
});

router.patch('/:productId',(req, res, next)=> {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }
    Product.update({ _id: id },{ $set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Sucesfull',
            createdProduct: {
                _id: result._id,
                    name: result.name,
                    brand: result.brand,
                    description: result.description,
                    category: result.category,
                    code: result.code, 
                    request: {
                        type: 'PATCH by ID',

                        url: 'http://localhost:3000/products'+result._id
                    }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
           error: err 
        });    
    }); 
});


router.delete('/:productId', (req, res, next)=> {
    const id = req.params.productId;
    Product.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products'+result._id,
                body: {name: 'String',brand: 'String', description: 'String' , category: 'String' , code: "Number"}


            }
        });
    })
    .catch(err=>{
        //console.log(err);
        res.status(500).json({
            error:err
        });
    });

});


module.exports = router;