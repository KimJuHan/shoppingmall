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

router.get('/products', adminController.productsList);

router.get('/products/register', csrfProtection, adminController.productsRegisterPage);

router.post('/products/register', upload.single('thumbnail'), csrfProtection, adminController.productRegister);

router.post('/products/ajax_summernote', upload.array('descriptionImages', 10), function(req, res){
    console.log(req.files);
    res.send(req.files);
})

router.get('/product/:id', adminController.productDetail);

router.get('/product/edit/:id', csrfProtection, adminController.productEditPage);

router.post('/product/edit/:id', upload.single('thumbnail'), csrfProtection, adminController.productEdit)

router.get('/product/delete/:id', adminController.productDestroy);



module.exports = router;