var passport = require('passport');
var naverStrategy = require('passport-naver').Strategy;
var db = require('../models');
var bcrypt = require('bcrypt');
var dotenv = require('dotenv');
dotenv.config();

var naverAccountsHelper = function(){
    passport.serializeUser(function (user, done) {
        console.log('serializeUser');
        done(null, user);
    });
     
    passport.deserializeUser(function (user, done) {
        console.log('deserializeUser');
        done(null, user);
    });
    passport.use(new naverStrategy({
            // https://developers.naver.com에서 appId 및 scretID 발급
            clientID: process.env.NAVER_CLIENTID,
            clientSecret: process.env.NAVER_SECRETCODE, 
            callbackURL: "http://localhost:4000/accounts/naver/callback",
            passReqToCallback: true 
        },
        function(req, accessToken, refreshToken, profile, done) {
            db.Users.findOne({ 
                where : {
                    userId : "n_" + profile.id,
                 }
            }).then(function(user) {
                req.accessToken = accessToken;
                console.log(accessToken);
                if (!user){  
                    bcrypt.hash(profile.id, 8, function(err, hash){
                        var user = {};
                        user.userId = "n_" + profile.id
                        user.password = hash
                        user.nickname = profile.displayName
                        user.addressCode = profile.address
                        user.smsConsent = req.cookies.smsConsent
                        user.sex = (profile.gender == 'male') ? 1 : 2
                        
                        // 이름만 req.user로 지정해주는 게 아니면 상관없다.
                        // req.user property를 지정하는 순간 req.isAuthenticated() => true
                        req.userinfo = user;

                        done(null, false, user);
                    })
                }else{ 
                    req.login(user, function(){
                        done(null,user);
                    });
                }
            });
        }
    ));
}

module.exports = naverAccountsHelper;