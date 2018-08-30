var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var db = require('../models');

var localAccountsHelper = function(){
    passport.serializeUser(function(user, done){
        console.log('serializeUser');
        done(null, user);
    })
    
    passport.deserializeUser(function(user, done){
        console.log('deserializeUser');
        done(null, user);
    })  
    
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, username, password, done){
        db.Users.findOne({
            where: {
                userId : username
            }
        }).then(function(user){
            if(!user){
                return done(null, false, {message: '아이디 또는 비밀번호 오류입니다.'});
            } else {
                bcrypt.compare(password, user.password, function(err, success){
                    console.log(user.dataValues);
                    if (success){
                        return done(null, user.dataValues);
                    }else{
                        return done(null, false, {message: '아이디 또는 비밀번호 오류입니다.'});
                    }
                })
            }
        })
    
    }
    ))
}

module.exports = localAccountsHelper;
