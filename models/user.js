'use strict';
var models = require('./index');

module.exports = (sequelize, DataTypes) => {
  var Users = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username : {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    cartList: {
      type: DataTypes.TEXT
    },
    usercode: {
      type: DataTypes.INTEGER(20)
    },
    email: {
      type: DataTypes.STRING
    },
    phoneNumber: {
      type: DataTypes.INTEGER(20)
    },
    knowHow: {
      type: DataTypes.INTEGER
    },
    nickname : {
      type: DataTypes.STRING
    },
    sex : {
      type: DataTypes.INTEGER
    },
    postCode : {
      type: DataTypes.STRING
    },
    addressCode : {
      type: DataTypes.STRING
    },
    smsConsent : {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
  return Users;
};
