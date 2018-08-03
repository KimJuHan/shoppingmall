var express = require('express');
var router = express.Router();
var accountsController = require('../controllers/accountsController')
var passport = require('passport');

require('../helper/localAccountsHelper')();
require('../helper/facebookAccountsHelper')();
require('../helper/kakaoAccountsHelper')();
require('../helper/naverAccountsHelper')();

router.get('/signUpAgree', accountsController.signUp_agree);

router.post('/signUpAgree', accountsController.signUp_agree_post);

router.get('/join', accountsController.signUpPage);

router.post('/join', accountsController.signUp); 

router.post('/IdDuplicatedCheck', accountsController.userIdDuplicationCheck);

router.post('/usernameDuplicatedCheck', accountsController.usernameDuplicationCheck);

router.get('/login',  accountsController.login);

//local
router.post('/login', passport.authenticate('local', { 
    failureRedirect: '/accounts/login', 
    failureFlash: true 
}), accountsController.loginAuthentication)

//facebook
router.get('/facebook', passport.authenticate('facebook', { authType: 'reauthenticate', scope : ['email']}));

router.get('/facebook/callback', function(req, res, next){
    passport.authenticate('facebook', function(){
        next();
    })(req, res, next)
}, accountsController.afterAuthentication);

//kakao
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', function(req, res, next){
    passport.authenticate('kakao', function(){
        next();
    })(req, res, next)
}, accountsController.afterAuthentication);

//naver
router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback', function(req, res, next){
    passport.authenticate('naver', function(){
        next();
    })(req, res, next)
}, accountsController.afterAuthentication);

router.get('/logout', accountsController.logout);

router.get('/popupSignup', accountsController.popupSignupPage);

router.post('/popupSignup', accountsController.signUpByOtherForm);

module.exports = router;
