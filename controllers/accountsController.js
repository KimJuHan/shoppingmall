var db = require('../models');
var bcrypt = require('bcrypt');
var passport = require('passport');
var FB = require('fb');
var request = require('request');
var dotenv = require('dotenv');
var urlencode = require('urlencode');
dotenv.config();

exports.signUpPage = function(req, res){
    res.render('accounts/joinForm');
}

exports.userIdDuplicationCheck = function(req, res){
    var data = req.body;
    for(var key in data){
        db.Users.findOne({
            where : { userId : key }
        }).then(function(user){
            if(user){
                res.send("true")
            }else{
                res.send("false")
            }
        })
    }
}

exports.usernameDuplicationCheck = function(req, res){
    var data = req.body;
    for(var key in data){
        db.Users.findOne({
            where : { nickname : key }
        }).then(function(user){
            if(user){
                res.send("true")
            }else{
                res.send("false")
            }
        })
    }
}

exports.signUp = function(req, res){
    console.log(req.body);
    bcrypt.hash(req.body.register_password, 8, function(err, hash){
        db.Users.create({
            userId : req.body.register_userid,
            password: hash,
            username: req.body.register_username,
            postCode: req.body.register_postcode,
            addressCode: req.body.register_first_address + " " + req.body.register_last_address,
            phone: req.body.register_phone1 + req.body.register_phone2 + req.body.register_phone3,
            mobile: req.body.register_mobile1 + req.body.register_mobile2 + req.body.register_mobile3,
            email: req.body.register_email + "@" + req.body.register_email_address,
            smsConsent: req.body.smsConsent,
            emailConsent: req.body.emailConsent
        }).then(function(){
            res.send('<script>alert("회원가입 성공");location.href="/accounts/login";</script>')
        })
    })
}

exports.login = function(req, res){
    if(req.query.orderType){
        var nonUserOrder = req.query.orderType
        req.session.orderType = nonUserOrder;
    }
    if(req.query.orderList){
        var orderList = req.query.orderList
        req.session.orderList = orderList
    }
    if(req.query.checkout){
        var checkout = req.query.checkout;
        req.session.checkout = checkout;
    }
    res.render('accounts/loginForm', { flashMessage : req.flash().error, nonUserOrder : ((nonUserOrder) ? nonUserOrder : ""), orderList  : ((orderList) ? (orderList) : ""), nonUserCheckout : ((checkout) ? checkout : "")})
}

exports.loginAuthentication = function(req, res){
    db.Users.findById(req.user.id).then(function(user){
        //user.cartList로 cartList 쿠키 갱신시키기 
        if(user.cartList){
            res.cookie('cartList', user.cartList, { expires : false, path: '/' })
        }
        //장바구니에서 로그인
        if(req.query.orderType){
            var x = req.query.orderType;
            x = x.replace(/["]/gi,'')
            res.send('<script>alert("로그인 성공");location.href="/cart/order?orderType=' + x + '"</script>')
        }else if(req.query.orderList){
            //상품상세페이지에서 바로주문하기
            var x = req.query.orderList;
            res.send('<script>alert("로그인 성공");location.href="/order?orderList=' + x + '"</script>')
        }else{
            //그냥 로그인페이지에서 로그인
            res.send('<script>alert("로그인 성공");location.href="/";</script>');
        }
    })
}

exports.afterAuthentication = function(req, res){
    if(req.user){
        //로그인 절차
        db.Users.findById(req.user.id).then(function(user){
            //user.cartList로 cartList 쿠키 갱신시키기 
            res.cookie('cartList', user.cartList, { expires : false, path: '/' })
            //장바구니에서 로그인
            if(req.session.orderType){
                var orderType = req.session.orderType;
                // 변수에 집어넣은 후 session에서 삭제
                delete req.session["orderType"];

                orderType = orderType.replace(/["]/gi,'')
                res.send('<script>alert("로그인 성공");window.close();window.opener.location.href="/cart/order?orderType=' + orderType + '"</script>')
            }else if(req.session.orderedProduct){
                console.log('xxx')
                //상세페이지에서 바로 주문하기 => 로그인 
                var orderedProduct = req.session.orderedProduct;
                console.log(orderedProduct);
                // 변수에 집어넣은 후 session에서 삭제
                delete req.session["orderedProduct"];

                res.send('<script>alert("로그인 성공");window.close();window.opener.location.href="/nonCartOrder?orderedProduct=' + escape(orderedProduct) + '"</script>')
            }else{
                //그냥 로그인페이지에서 로그인
                res.send('<script>alert("로그인 성공");window.close();window.opener.location.href="/";</script>');
            }
        })
    }else{
        //회원가입 절차
        req.session.user = req.userinfo;
        res.redirect('/accounts/popupSignup');
    }
}

exports.popupSignupPage = function(req, res){ 
    res.render('accounts/popupSignup')
}

exports.signUpByOtherForm = function(req, res){
    var user = req.session.user;
    delete req.session.user;
    db.Users.create({
        userId : user.userId,
        password : user.password,
        username : req.body.register_username,
        postCode : req.body.register_postcode,
        addressCode : req.body.register_first_address + ' ' + req.body.register_last_address,
        email : req.body.register_email + '@' + req.body.register_email_address,
        emailConsent : req.body.emailConsent,
        smsConsent : req.body.smsConsent, 
        phone : req.body.register_phone1 + req.body.register_phone2 + req.body.register_phone3,
        mobile : req.body.register_mobile1 + req.body.register_mobile2 + req.body.register_mobile3
    }).then(function(user){
        req.logIn(user, function(){
            if(req.session.orderType){
                var orderType = req.session.orderType;
                // 변수에 집어넣은 후 session에서 삭제
                delete req.session["orderType"];
                orderType = orderType.replace(/["]/gi,'')

                res.send('<script>alert("로그인 성공");window.close();window.opener.location.href="/cart/order?orderType=' + x + '"</script>')
            }else if(req.session.orderedProduct){
                var orderedProduct = req.session.orderedProduct;
                // 변수에 집어넣은 후 session에서 삭제
                delete req.session["orderedProduct"];

                res.send('<script>alert("로그인 성공");window.close();window.opener.location.href="/nonCartOrder?orderedProduct=' + escape(orderedProduct) + '"</script>')
            }else{
                res.send('<script>alert("회원가입 완료");window.close();window.opener.location.href="/";</script>')
            }
        });
    })
}

exports.logout = function(req, res){
    req.logout();
    res.clearCookie('cartList');
    res.send('<script>alert("로그아웃 되셨습니다");location.href="/accounts/login"</script>')
}


