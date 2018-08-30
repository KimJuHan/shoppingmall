var passport = require('passport');
var kakaoStrategy = require('passport-kakao').Strategy;
var db = require('../models');
var bcrypt = require('bcrypt');
var dotenv = require('dotenv');
dotenv.config();

var kakaoAccountsHelper = function(){
    passport.serializeUser(function (user, done) {
        console.log('serializeUser');
        done(null, user);
    });
     
    passport.deserializeUser(function (user, done) {
        console.log('deserializeUser');
        done(null, user);
    });
    passport.use(new kakaoStrategy({
            // https://developers.kakao.com에서 appId 및 scretID 발급
            clientID: process.env.KAKAO_RESTAPI, 
            callbackURL: "http://localhost:5000/accounts/kakao/callback",
            passReqToCallback: true 
        },
        function(req, accessToken, refreshToken, params, profile, done) {
            console.log(params);
            console.log(profile.id);
            db.Users.findOne({ 
                where : {
                    userId : "k_" + profile.id,
                 }
            }).then(function(user) {
                req.accessToken = accessToken;

                if (!user){  
                    bcrypt.hash(profile.id, 8, function(err, hash){
                        var user = {};
                        user.userId = "k_" + profile.id
                        user.password = hash
                        
                        // 이름만 req.user로 지정해주는 게 아니면 상관없다.
                        // req.user property를 지정하는 순간 req.isAuthenticated() => true!
                        req.userinfo = user;

                        done(null, false, user);
                    })
                }else{ 
                    console.log('xxxxxx');
                    req.login(user, function(){
                        done(null,user);
                    });
                }
            });
        }
    ));
}

module.exports = kakaoAccountsHelper;