'use strict';
module.exports = (sequelize, DataTypes) => {
  var Carts = sequelize.define('Carts', {
    amount: DataTypes.INTEGER,
    optionId: DataTypes.INTEGER
  });

  Carts.associate = function(models){
    Carts.belongsTo(models.Users);
    Carts.belongsTo(models.Checkouts);
  }
  return Carts;
};