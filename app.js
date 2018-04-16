const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const marketsRoutes = require('./api/routes/markets');
const productbymarketSchema = require('./api/routes/productsbymarkets');
const user = require('./api/routes/users');


//MongoAtlas Conection
mongoose.connect('mongodb://admin:'+process.env.MONGO_ATLAS_PW+'@cluster0-shard-00-00-xjqpk.mongodb.net:27017,cluster0-shard-00-01-xjqpk.mongodb.net:27017,cluster0-shard-00-02-xjqpk.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

mongoose.Promise = global.Promise;


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req , res, next)=>{
    res.header("Access-Control-Allow-Origien","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Contenet-Typr, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});
 
//Rutas que maneja 
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/markets',marketsRoutes);
app.use('/productsbymarkets',productbymarketSchema);
app.use('/users', user);


app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status(404);
    next(error);
});


app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;