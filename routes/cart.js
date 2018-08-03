var express = require('express');
var router = express.Router();
var cartController = require('../controllers/cartController');
var db = require('../models');
var request = require('request');
var dotenv = require('dotenv');
dotenv.config();

router.get('/', cartController.cartIndex);

router.post('/', cartController.cartDelete);

router.get('/order', cartController.cartOrder);

//주문전 바뀐 수량에 대하여 갱신된 쿠키를 유저 칼럼에 집어넣기
router.post('/userCartList/renew', cartController.cartUserCookieSync);

//iamport에서 고객이 주문한 상품이 제대로 주문완료가 되었는지 확인해주는 ajax 요청
router.get('/order/complete', async function(req, res){
    var amount = req.body.amount;
    var imp_uid = req.body.imp_uid;
    var accessToken;

    var getAccessToken = function(){
        return new Promise(function(resolve, reject){
            var formData = {
                imp_key : process.env.IMP_KEY,
                imp_secret : process.env.IMP_SECRET
            };
            request.post({url: 'http://api.iamport.kr/users/getToken', formData : formData }, function(err, res, body){
                if (err) {
                    return console.error(err);
                  }
                accessToken = JSON.parse(body).response.access_token
                resolve(accessToken);
            });
        })
    }

    var paymentsCertification = function(){
        return new Promise(function(resolve, reject){
            var options = {
                url : 'http://api.iamport.kr/payments/' + imp_uid,
                headers : {
                    Authorization : accessToken
                }
            };
            request(options, function(err, res, body){
                var paymentInfo = JSON.parse(body).response;
                //paymentInfo에서 이미 false가 나버리기때문에 뒤에것들은 확인하지 않는다??? 
                if(paymentInfo && paymentInfo.status == "paid" && paymentInfo.amount == amount){
                    res.send("payment complete")
                }else if(paymentInfo.status == "ready" && paymentInfo.pay_method == "vbank"){
                    res.send("vbank register complete")
                }else{
                    res.send("payment fail")
                }
            });
        })
    }
    //access token 얻기
    await getAccessToken();

    //지불내역 상세확인
    await paymentsCertification();

})

//iamport에서 고객이 주문한 상품이 제대로 주문완료가 되었는지 확인해주는 요청(모바일버전)


router.post('/order/backup', function(req, res){
    res.send('hello world')
})
module.exports = router;

