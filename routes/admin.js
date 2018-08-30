var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var path = require('path');

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

//관리자 권한 체크 미들웨어
var adminRequired = require('../helper/adminRequired');

router.use(adminRequired)

/*관리자 인덱스페이지*/
router.get('/', adminController.indexPage);

/*상품관리*/
//상품관리 인덱스페이지
router.get('/products', adminController.productIndexPage);

//상품등록페이지
router.get('/products/register', csrfProtection, adminController.productsRegisterPage);

router.post('/products/register', upload.single('thumbnail'), csrfProtection, adminController.productRegister);

router.post('/products/register/ajax_summernote', upload.array('descriptionImages', 10), function(req, res){
    console.log(req.files);
    res.send(req.files);
})

//상품목록페이지
router.get('/products/list', adminController.productsList)

//재고관리페이지
router.get('/products/stockOperation', adminController.stockOperation);

//상품상세 페이지
router.get('/product/edit/:id', csrfProtection, adminController.productEditPage);

router.post('/product/edit/:id', upload.single('thumbnail'), csrfProtection, adminController.productEdit)

router.get('/product/delete/:id', adminController.productDestroy);

// //주문리스트 페이지
// router.get('/orderList', adminController);

// router.post('/orderList', adminController);

// //공지사항 작성하기 페이지
// router.get('/notice_register', adminController);

// router.post('/notice_register', adminController);

// //분석
// router/get('/analytics', adminController);


module.exports = router;