var db = require('../models')

exports.checkout = function(req, res){
    if(req.user){
        db.Checkouts.findAll({where : { name : req.user.name }}).then(function(orderedProducts){
            res.render('myshop/checkout', { orderedProducts : orderedProducts })  
        })
    }else{
        res.redirect('/accounts/login?checkout=true')
    }
}