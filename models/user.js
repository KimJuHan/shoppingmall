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
    email: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    mobile: {
      type: DataTypes.STRING
    },
    postCode : {
      type: DataTypes.STRING
    },
    addressCode : {
      type: DataTypes.STRING
    },
    smsConsent : {
      type: DataTypes.STRING
    },
    emailConsent : {
      type: DataTypes.STRING
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
