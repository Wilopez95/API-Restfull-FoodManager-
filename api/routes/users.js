const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');

router.post('/check',checkAuth,(req, res, next)=>{
    res.status(201).json({
        message: 'Token valido',
        token : req.params.token
    });
});

router.post('/signup',(req, res, next)=>{
    //Encontrar por parametro
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >=  1){
            return res.status(422).json({
                message: 'El correo ya esta registrado'
            });
        }else{
            bcrypt.hash(req.body.password,10,(err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else{
                    const user =  new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        name:req.body.name,
                        phone: req.body.phone,
                        type: req.body.type
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            message: 'El usuario ha sido creado'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                           error: err 
                        })
                    });
                }
              })
        }
    }) 
});

router.post('/login',(req, res, next)=> {
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length< 1){
            return res.status(401).json({
                message: 'Autentifiacion fallida'
            });
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(400).json({
                    message: 'Autentifiacion fallida'
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id,
                    name: user[0].name,
                    phone: user[0].phone,
                    type: user[0].type
                },
               "secret",
            {
                expiresIn:"10h"
            }
        );
               return res.status(200).json({
                   message: 'Autentifiacion exitosa',
                   name: user[0].name,
                   userId: user[0]._id,                   
                   token: token
               })
            }
            return res.status(400).json({
                message: 'Autentifiacion fallida'
            });
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
           error: err 
        })
    });
});
//Update phone
router.patch('/phone/:userId',(req, res, next)=> {
    const id = req.params.userId;
    const updateOps = {};
    /*for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }*/
    User.update({ _id: id },{ phone: req.body.value})
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
//Update name
router.patch('/name/:userId',(req, res, next)=> {
    const id = req.params.userId;
    const updateOps = {};
    /*for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }*/
    User.update({ _id: id },{ name: req.body.value})
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

module.exports = router;