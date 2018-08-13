var express = require('express');
var router = express.Router();
var nonCartOrderController = require('../controllers/nonCartOrderController');

router.get('/', nonCartOrderController.order);

module.exports = router;