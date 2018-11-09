var express = require('express');
var router = express.Router();
var orderController = require('../controllers/orderController');
var db = require('../models');

//즉시주문
router.get('/', async function(req, res){
    var orderList = JSON.parse(unescape(req.query.orderList));
    console.log(orderList);
    const number = orderList[Object.keys(orderList)[0]]['number'];
    const product = await db.Products.find({where : {id : Object.keys(orderList)[0]}, include: [db.Options]})
    console.log(number);
    console.log(product);
    console.log(product.id);
    console.log(product.dataValues);
    res.render('order/index', { number : number, product: product })
})

module.exports = router;