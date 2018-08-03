var db = require('../models');

exports.productDetail = function(req, res){
    db.Products.findById(req.params.id).then(function(product){
        res.render('products/productDetail', {product:product})
    })
}

exports.cartInsert = function(req, res){
    //{5:{}}
    //ajax로 json형식으로 바로쏴줬기 때문에 객체이다. 
    var cartList = req.body;
    console.log(cartList);
    // 로그인되있냐
    if(req.isAuthenticated()){
        // user 모델에 cartList 데이터 담기 
        db.Users.findById(req.user.id)
        .then(function(user){
            if(user.cartList){
                var x = JSON.parse(user.cartList);
                for(let key in cartList){
                    x[key] = cartList[key];
                    console.log(x);
                };
                db.Users.update({
                    cartList : JSON.stringify(x)
                }, {
                    where : { id : user.id }
                })
            }else{
                db.Users.update({
                    cartList : JSON.stringify(cartList)
                }, {
                    where : { id : user.id }
                })
            }
        })
        .then(function(){
            //회원의 cartList 칼럼에 작성됨
            console.log("회원님의 cartList에 물건이 저장되었습니다.")
        })
    }else{
        //비회원 주문 - 쿠키로만 가지고 있는 상태
        console.log("비회원 주문입니다. 쿠키만 있는 상태입니다.")
    };
    res.send(req.body);
}