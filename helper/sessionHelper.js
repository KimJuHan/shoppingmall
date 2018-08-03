var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var db = require('../models')
var dotenv = require('dotenv');
dotenv.config();

var sessionMiddleware = session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000*60, 
        httpOnly: true
    },
    store: new SequelizeStore({
        db: db.sequelize
    })
})

module.exports = sessionMiddleware;