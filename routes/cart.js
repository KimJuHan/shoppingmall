var express = require('express');
var router = express.Router();
var cartController = require('../controllers/cartController');
var db = require('../models');
var request = require('request');
var axios = require('axios');
var dotenv = require('dotenv');
dotenv.config();

router.get('/', cartController.cartIndex);

router.post('/', cartController.cartDelete);

router.get('/order', cartController.cartOrder);

//주문전 바뀐 수량에 대하여 갱신된 쿠키를 유저 칼럼에 집어넣기
router.post('/userCartList/renew', cartController.cartUserCookieSync);

//이니시스연동하기 전 디비에 정보 기록 for: script문 변조공격대비 나중에 정보대조를 위한
router.post('/order/recordeBeforeComplete', function(){
        db.Checkouts.create({
            name : req.body.name,
            amount : req.body.amount,
            productImage : req.body.productImage,
            buyer_email : req.body.buyer_email,
            buyer_name : req.body.buyer_name,
            buyer_tel : req.body.buyer_tel,
            buyer_addr : req.body.buyer_addr,
            buyer_postcode : req.body.buyer_postcode,
            Recipient_name : req.body.Recipient_name,
            Recipient_addr : req.body.Recipient_addr,
            Recipient_postcode : req.body.Recipient_postcode,
            Recipient_tel : req.body.Recipient_tel
        }).then(function(){
            res.send("true")
        })
})

//iamport에서 고객이 주문한 상품이 제대로 주문완료가 되었는지 확인해주는 ajax 요청
router.post('/order/complete', async function(req, res){
    try{
        const { imp_uid, merchant_uid } = req.body;
        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.IMP_KEY, // REST API키
                imp_secret: process.env.IMP_SECRET // REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰

        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보

        // DB에서 결제되어야 하는 금액 조회
        const order = await db.Checkouts.findOne({where : {merchant_uid : paymentData.merchant_uid}});
        const amountToBePaid = order.amount; // 결제 되어야 하는 금액

        // 결제 검증하기
        const { amount, status } = paymentData;
        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            switch (status) {
                case "ready": // 가상계좌 발급
                    // DB에 가상계좌 발급 정보 저장
                    const { vbank_num, vbank_date, vbank_name } = paymentData;
                    await db.Checkouts.update({
                        status : status,
                        merchant_uid : req.body.merchant_uid,
                        imp_uid : req.body.imp_uid,
                        vbank_num : vbank_num,
                        vbank_date : vbank_date,
                        vbank_name : vbank_name
                    }, { where : {merchant_uid : paymentData.merchant_uid}})
                    
                    // 가상계좌 발급 안내 문자메시지 발송
                    // SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
                    res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                    break;
                case "paid": // 결제 완료
                    await db.Checkouts.update({
                        status : status,
                        merchant_uid : req.body.merchant_uid,
                        imp_uid : req.body.imp_uid
                    }, { where : {merchant_uid : paymentData.merchant_uid}})

                    res.send({ status: "success", message: "일반 결제 성공" });
                    break;
            }
        } else { // 결제 금액 불일치. 위/변조 된 결제
            throw { status: "forgery", message: "위조된 결제시도" };
        }

    } catch(e){
        res.status(400).send(e);
    }
})

//모바일로 주문한경우 여기로 리다이렉션됨
router.get('/order/complete/mobile', async function(req, res){
    try {
        const { imp_uid, merchant_uid } = req.query; // req의 query에서 imp_uid, merchant_uid 추출

        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.IMP_KEY, // REST API키
                imp_secret: process.env.IMP_SECRET // REST API Secret
            }
        });
        const { access_token } = getToken.data.response; // 인증 토큰

        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보

        // DB에서 결제되어야 하는 금액 조회
        const order = await db.Checkouts.findOne({where : {merchant_uid : paymentData.merchant_uid}});
        const amountToBePaid = order.amount; // 결제 되어야 하는 금액

        // 결제 검증하기
        const { amount, status } = paymentData;
        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            await db.Checkouts.update({
                status : status
            }, { where : { merchant_uid : paymentData.merchant_uid }})
            
            switch (status) {
                case "ready": // 가상계좌 발급
                    // DB에 가상계좌 발급 정보 저장
                    const { vbank_num, vbank_date, vbank_name } = paymentData;
                    await db.Checkouts.update({
                        status : status,
                        merchant_uid : req.body.merchant_uid,
                        imp_uid : req.body.imp_uid,
                        vbank_num : vbank_num,
                        vbank_date : vbank_date,
                        vbank_name : vbank_name
                    }, { where : {merchant_uid : paymentData.merchant_uid}})
                    
                    // 가상계좌 발급 안내 문자메시지 발송
                    // SMS.send({ text: `가상계좌 발급이 성공되었습니다. 계좌 정보 ${vbank_num} ${vbank_date} ${vbank_name}`});
                    res.send({ status: "vbankIssued", message: "가상계좌 발급 성공" });
                    break;
                case "paid": // 결제 완료
                    await db.Checkouts.update({
                        status : status,
                        merchant_uid : req.body.merchant_uid,
                        imp_uid : req.body.imp_uid
                    }, { where : {merchant_uid : paymentData.merchant_uid}})
                    
                    res.send({ status: "success", message: "일반 결제 성공" });
                    break;
            }
        } else { // 결제 금액 불일치. 위/변조 된 결제
            throw { status: "forgery", message: "위조된 결제시도" };
        }

    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/order/backup', function(req, res){
    res.send('hello world')
})
module.exports = router;

