var db = require('../models');

exports.cartIndex = function(req, res){
    var cartList = {}; //장바구니 리스트
    if(req.cookies.cartList){
        cartList = JSON.parse(unescape(req.cookies.cartList));
    }
    res.render('cart/index', { cartList : cartList } );
};

exports.cartUserCookieSync = function(req, res){
    var cartList = req.body;
    var x = JSON.parse(req.user.cartList);
    for(let key in cartList){
        x[key] = cartList[key];
    }; 
    db.Users.update({
        cartList : JSON.stringify(x)
    }, {
        where : { id : req.user.id }
    }).then(function(){
        //회원의 cartList 칼럼에 작성됨
        console.log("회원님의 cartList에 물건이 저장되었습니다.")
        res.send('true')
    })
};

exports.cartDelete = function(req, res){
    var data = req.body;
    for(var key in data){
        db.Users.findById(req.user.id)
            .then(function(user){
                var originalCartList = JSON.parse(user.cartList);
                delete originalCartList[key];
                db.Users.update({
                    cartList : JSON.stringify(originalCartList)
                },{
                    where : { id : req.user.id }
                })  
            }) 
            .then(function(){
                res.send("데이터 송신")
            }) 
    }
};

exports.cartOrder = function(req, res){
    //회원 비회원주문 구분하기 이전에 장바구니에 상품이 있는지부터 검증
    if(!req.cookies.cartList){
        res.send('<script>alert("장바구니에 아무것도 없습니다.");window.history.back();</script>')
    }else{
        if(req.user){
            //로그인이 되어있다. or 로그인화면으로 간 후 다시 여기로 온다.
            console.log(req.query);
            cartList = JSON.parse(req.cookies.cartList);
            var x = Object.keys(cartList)

            if(req.query.checkBox || req.query.orderType.indexOf('checkBox')!=-1){
                if(req.query.checkBox){
                    //이 경우가 로그인하고 주문하기 버튼 누른 경우 => cartList쿠키와 비교해서 빼주고, user.cartList하고 갱신시킬 필요는 x
                    console.log(req.query.checkBox)
                    //선택된 물건이 여러개일 경우(배열로 받는다.)
                    if(Array.isArray(req.query.checkBox)){
                        req.query.checkBox.forEach(function(element){
                            var index = x.indexOf(element);
                            if (index !== -1) x.splice(index, 1);
                        })
                }else{
                        //선택된 물건이 하나일 경우(스트링으로 받는다.)
                        var index = x.indexOf(req.query.checkBox);
                        if (index !== -1) x.splice(index, 1);
                    }
                    x.forEach(function(unselected){
                        delete cartList[unselected];
                    })
                }
            }
            res.render('cart/order/index', { cartList : cartList } );
        }else{
            //로그인이 안되어 있다.

            //로그인 화면으로 갔다가 => 비회원주문하기
            if(req.query.orderType.indexOf('nonUser')!= -1){
                var x = JSON.parse(req.cookies.cartList);
                var y = unescape(req.query.orderType);
                var cartList = {};
                
                if(req.query.orderType.indexOf('checkBox')!= -1){
                    //선택상품주문
                    y = y.replace(/"/g, "");
                    if(y.indexOf('[')!= -1){
                        y = y.split('[')[1].split(']')[0].split(',');
                        y.forEach(function(e){
                            cartList[e] = x[e];
                        })
                    }else{
                        //한개만 선택한 경우
                        var one = y.indexOf('%nonUser') - 1
                        one = y[one]
                        cartList[one] = x[one];
                    }
                    res.render('cart/order/index', { cartList : cartList } );
                }else{
                    //전체상품주문
                    res.render('cart/order/index', { cartList : x })
                }
            }else{
            //로그인이 안되어 있어서 로그인화면으로 감
                res.redirect('/accounts/login' + ((req.query.orderType) ? ("?orderType=" + req.query.orderType) : "") + ((req.query.checkBox) ? ("?checkBox=" + escape(JSON.stringify(req.query.checkBox))) : ""));
            }
        }
    }
};

