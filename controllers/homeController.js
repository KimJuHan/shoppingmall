var db = require('../models');

exports.indexPage = function(req, res){
    db.Products.findAll().then(function(products){
        res.render('home/index', {products : products});
    })
}

