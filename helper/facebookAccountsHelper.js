var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var db = require('../models');
var bcrypt = require('bcrypt');
var dotenv = require('dotenv');
dotenv.config();

var facebookAccountsHelper = function(){
    passport.serializeUser(function (user, done) {
        console.log('serializeUser');
        done(null, user);
    });
     
    passport.deserializeUser(function (user, done) {
        console.log('deserializeUser'); 
        done(null, user);
    });
    passport.use(new FacebookStrategy({
            // https://developers.facebook.com에서 appId 및 scretID 발급
            clientID: process.env.FACEBOOK_CLIENTID, 
            clientSecret: process.env.FACEBOOK_SECRETCODE, 
            callbackURL: "http://localhost:4000/accounts/facebook/callback",
            profileFields: ['id', 'displayName', 'gender', 'address', 'email'],
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            db.Users.findOne({ 
                where : {
                    userId : "fb_" + profile.id,
                 }
            }).then(function(user) {
                req.accessToken = accessToken;

                if (!user){  
                    //첫번째 authentication 미들웨어 걸어주면 여기로 들어옴
                    //facebook/callback에 있는 authentication은 여기있는 코드가 실행되는게
                    //아니라 그냥 deserializer가 실행된다. 
                    //결론 : authentication 메소드는 처음 걸린 url에 미들웨어에서만 
                    //serializer로서 실행되고 나머지 url에서는 여기있는 코드가 실행되는게 아니라
                    //deserializer가 실행된다.
                    bcrypt.hash(profile.id, 8, function(err, hash){
                        var user = {};
                        user.userId = "fb_" + profile.id
                        user.password = hash
                        user.nickname = profile.displayName
                        user.addressCode = profile.address
                        user.smsConsent = req.cookies.smsConsent
                        user.sex = (profile.gender == 'male') ? 1 : 2
                        
                        // 이름만 req.user로 지정해주는 게 아니면 상관없다.
                        // req.user property를 지정하는 순간 req.isAuthenticated() => true!
                        req.userinfo = user;

                        done(null, false, user);    
                    })
                }else{ 
                    // get('/facebook')을 눌렀는데 db에 user가 없는 경우
                    // 보통은 회원가입후 db에 있다면 여기 제어문으로 온다.
                    // 근데 완벽하게 회원가입되지 않고 도중에 꺼지는 경우가
                    // 생길 수 있다. 그런경우 db에 phoneNumber가 들어가있지
                    // 않는다. 
                    req.login(user, function(){
                        done(null,user);
                    });
                }
            });
        }
    ));
}

module.exports = facebookAccountsHelper;