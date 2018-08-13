var express = require('express');
var router = express.Router();
var myshopController = require('../controllers/myshopController');

router.get('/checkout', myshopController.checkout);

module.exports = router;
