var db = require('../models');
var fs = require('fs');
var path = require('path');
var uploaddir = path.join(__dirname, '../public/uploads');

exports.indexPage = function(req, res){
    console.log('admin IndexPage controller');
    res.render('admin/index');
}

exports.productIndexPage = function(req, res){
    console.log('productIndexPage controller');
    res.render('admin/productsIndex');
}  


exports.productsRegisterPage = function(req, res){
    res.render('admin/form', {product:"", csrfToken: req.csrfToken()});
}

exports.productRegister = function(req, res){
    db.Products.create({
        name : req.body.name,
        thumbnail : (req.file) ? req.file.filename : "",
        price : req.body.price,
        stock : req.body.stock,
        bestProduct : (req.body.bestProduct) ? true : false,
        eventProduct : (req.body.eventProduct) ? true : false,
        description : req.body.description
    }).then(function(){
        res.redirect('/admin/products');
    })
}

exports.productsList = function(req, res){
    db.Products.findAll().then(function(products){
        res.render('admin/productsList', { products : products })
    })
}

exports.productEditPage = function(req, res){
    db.Products.findById(req.params.id).then(function(product){
        res.render('admin/form', {product:product, csrfToken: req.csrfToken()});
    })
}

exports.productEdit = function(req, res){
    db.Products.findById(req.params.id).then(async function(product){
        //썸네일 사진이랑 description사진이랑 중복되면 안된다. uploads에서 삭제되기 때문
        await function(){
            if(product.thumbnail && req.file){
                fs.unlinkSync( uploaddir + '\\' + product.thumbnail)
            }
        }();

        await function(){
            db.Products.update({
                name : req.body.name,
                thumbnail : (req.file)? req.file.filename : product.thumbnail,
                price : req.body.price,
                description : req.body.description,bestProduct : (req.body.bestProduct) ? true : false,
                eventProduct : (req.body.eventProduct) ? true : false        
            }, {
                where : { id : req.params.id }
            }).then(function(){
                res.redirect('/admin/products/list')
            })
        }();
    })
}

exports.productDestroy = async function(req, res){
    await function(){ 
        db.Products.findById(req.params.id).then(function(product){
            fs.readdirSync(uploaddir).forEach(function(file){
                if (product.description.indexOf(file) != -1){
                    fs.unlinkSync(uploaddir + '\\' + file);
                }
                if (product.thumbnail){
                    fs.unlinkSync( uploaddir + '\\' + product.thumbnail)
                }
            })
        })
    }();

    await function(){
        db.Products.destroy({
            where : { id : req.params.id }
        }).then(function(){
            res.redirect('/admin/products/list');
        })
    }();
}

exports.stockOperation = function(req, res){
    db.Products.findAll().then(function(products){
        res.render('admin/productStock', { products : products })
    })
}