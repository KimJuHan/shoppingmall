'use strict';
module.exports = (sequelize, DataTypes) => {
  var Products = sequelize.define('Products', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    thumbnail: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.TEXT
    },
    stock : {
      type: DataTypes.INTEGER
    },
    bestProduct : {
      type : DataTypes.BOOLEAN
    },
    eventProduct : {
      type : DataTypes.BOOLEAN
    },
    sales : {
      type : DataTypes.INTEGER
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
  Products.associate = function(models){
    Products.hasMany(models.Reviews);
    Products.hasMany(models.QnAs);
    Products.hasMany(models.Options);
  }
  return Products;
};