exports.order = function(req, res){
    var orderedProduct;
    if(req.user){
        orderedProduct = unescape(req.query.orderedProduct);
    }else{
        orderedProduct = unescape(req.query.orderedProduct.replace("%nonUser",''));
    }
    res.render('cart/order/index', {cartList : JSON.parse(orderedProduct)})
};