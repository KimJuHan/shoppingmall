var db = require('../models');

exports.indexPage = async function(req, res){
    const bestProducts = await db.Products.findAll({where : { bestProduct : true }})
    const eventProducts = await db.Products.findAll({where : { eventProduct : true }})
    const Reviews = await db.Reviews.findAll({where : { bestReview : true }})
    // const Reviews = await db.Reviews.findAndCountAll({ limit : 10 })

    res.render('home/index', {bestProducts : bestProducts, eventProducts : eventProducts, Reviews : Reviews});    
}

