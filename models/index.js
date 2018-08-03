var Sequelize = require('sequelize');
var path = require('path');
var fs = require('fs');
var config = require('../config/settings.json');

var sequelize = new Sequelize(config.model.database, config.model.db_user, config.model.db_password, {
    host: config.model.db_host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})

let db = {};

fs.readdirSync(__dirname)
    .filter(function(file){
        return file.indexOf('.js') && file !== 'index.js'
    })
    .forEach(function(file){
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    })

Object.keys(db).forEach(function(modelName){
    if ("associate" in db[modelName]){
        db[modelName].associate(db);
    }
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;