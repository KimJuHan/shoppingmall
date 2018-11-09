var express = require('express');
var router = express.Router();
var productsController = require('../controllers/productsController');

router.get('/:id', productsController.productDetail);

router.post('/:id/cartDuplication', productsController.cartDuplication);

router.post('/:id', productsController.cartInsert);

module.exports = router;

