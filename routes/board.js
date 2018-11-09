var express = require('express');
var router = express.Router();
var boardController = require('../controllers/boardController');
var path = require('path');
var db = require('../models');

//multer settings
var uploaddir = path.join(__dirname, '../public/uploads');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, uploaddir);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})
var upload = multer({ storage : storage });

//Q&A페이지
router.get('/QnA', boardController.AllQnA);

//경고창 페이지 *밑에 :id랑 충돌되기때문에 이게 먼저 나와야한다.
router.get('/QnA/secretWarning', boardController.secretWarning);

//Q&A쓰기페이지 *밑에 :id랑 충돌되기때문에 이게 먼저 나와야한다.
router.get('/QnA/write', boardController.QnAWritingForm);

//Q&A 검색
router.get('/QnA/search', boardController.QnAsearch);

//Q&A디테일 페이지
router.get('/QnA/:id', boardController.QnADetail);

//비밀글에서 비밀번호 일치 => QnA/:id로 다시 ㄱ
router.post('/QnA/secretWarning', boardController.passwordAuthentication);

//Q&A페이지에서 작성
router.post('/QnA/write', boardController.QnAWrite);

//리뷰페이지
router.get('/reviews', boardController.review);

//리뷰ajax최신순으로 
router.post('/reviews/newest', async function(req, res){
    var productId = Object.keys(req.body)[0]
    const reviews = await db.Reviews.findAll({where : { ProductId : productId }, order: [['createdAt', 'DESC']], include : [db.Users]})
    console.log(reviews);
    res.send(reviews);
})

//리뷰ajax평점순으로 
router.post('/reviews/orderRates', async function(req, res){
    var productId = Object.keys(req.body)[0]
    const reviews = await db.Reviews.findAll({where : { ProductId : productId }, order: [['star', 'DESC']], include : [db.Users]})
    res.send(reviews);
})

//상품문의ajax답변완료
router.post('/qnas/complete', async function(req, res){
    var productId = Object.keys(req.body)[0];
    const qnas = await db.QnAs.findAll({
        where : { ProductId : productId, status : "답변완료" },
        include : [db.Users]
    });
    console.log(qnas);
    res.send(qnas);
})

//상품문의ajax전체보기
router.post('/qnas/all', async function(req, res){
    const qnas = await db.QnAs.findAll({
        include : [db.Users]
    });
    res.send(qnas);
}) 

//공지사항페이지
router.get('/notice', boardController.notice);

//ajax-summernote
router.post('/ajax_summernote', upload.array('descriptionImages', 10), function(req, res){
    res.send(req.files);
})



module.exports = router;
