'use strict';
module.exports = (sequelize, DataTypes) => {
  var Options = sequelize.define('Options', {
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT
  });

  Options.associate = function(models){
    Options.belongsTo(models.Products);
  }
  return Options;
};