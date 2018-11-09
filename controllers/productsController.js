var db = require('../models');

exports.productDetail = async function(req, res){
    const product = await db.Products.find(
        {where : {id : req.params.id}, include : [{
            model: db.Reviews,
            include: [db.Users]
        }, db.Options, {
            model: db.QnAs,
            include: [db.Users]
        }
        ]}
    );
    console.log(product);
    console.log(product.Reviews);
    res.render('products/productDetail', {product:product});
}

exports.cartDuplication = async function(req, res){
    var cartList = req.body;
    const number = cartList[Object.keys(cartList)[0]]['number'];
    const optionId = cartList[Object.keys(cartList)[0]]['optionId'];
    const cart = await db.Carts.update({
        amount : number,
        optionId : (optionId != 0) ? optionId : null,
        UserId : (req.user) ? req.user.id : null
    },
        {where : { sessionId : req.session.id }
    })
    res.send(cart);
}

exports.cartInsert = async function(req, res){
    console.log(req.user);
    console.log('xxxx');
    var cartList = req.body;
    const number = cartList[Object.keys(cartList)[0]]['number'];
    const optionId = cartList[Object.keys(cartList)[0]]['optionId'];
    const cart = await db.Carts.create({
        sessionId : req.session.id,
        amount : number,
        optionId : (optionId != 0) ? optionId : null,
        UserId : (req.user) ? req.user.id : null
    }).then(function(cart){
        res.send(cart);
    })
}

// exports.cartInsert = function(req, res){
//     //{5:{}}
//     //ajax로 json형식으로 바로쏴줬기 때문에 객체이다. 
//     var cartList = req.body;
//     console.log(cartList);
//     // 로그인되있냐
//     if(req.isAuthenticated()){
//         // user 모델에 cartList 데이터 담기 
//         db.Users.findById(req.user.id)
//         .then(function(user){
//             if(user.cartList){
//                 var x = JSON.parse(user.cartList);
//                 for(let key in cartList){
//                     x[key] = cartList[key];
//                     console.log(x);
//                 };
//                 db.Users.update({
//                     cartList : JSON.stringify(x)
//                 }, {
//                     where : { id : user.id }
//                 })
//             }else{
//                 db.Users.update({
//                     cartList : JSON.stringify(cartList)
//                 }, {
//                     where : { id : user.id }
//                 })
//             }
//         })
//         .then(function(){
//             //회원의 cartList 칼럼에 작성됨
//             console.log("회원님의 cartList에 물건이 저장되었습니다.")
//         })
//     }else{
//         //비회원 주문 - 쿠키로만 가지고 있는 상태
//         console.log("비회원 주문입니다. 쿠키만 있는 상태입니다.")
//     };
//     res.send(req.body);
// }