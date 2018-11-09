'use strict';
module.exports = (sequelize, DataTypes) => {
  var QnAs = sequelize.define('QnAs', {
    title: {
      type : DataTypes.STRING(200)
    },
    content: {
      type : DataTypes.TEXT
    },
    password: {
      type : DataTypes.STRING
    },
    status: {
      type : DataTypes.STRING
    },
    display: {
      type : DataTypes.STRING
    },
    category: {
      type : DataTypes.STRING
    }
  });
  QnAs.associate = function(models){
    QnAs.belongsTo(models.Users);
    QnAs.belongsTo(models.Products);
  }
  return QnAs;
};