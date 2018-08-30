'use strict';
module.exports = (sequelize, DataTypes) => {
  var Checkouts = sequelize.define('Checkouts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    merchant_uid : {
      type : DataTypes.STRING(1200)
    },
    imp_uid : {
      type : DataTypes.STRING(1200)
    },
    orderList : {
      type : DataTypes.TEXT
    },
    directOrder : {
      type : DataTypes.TEXT
    },
    productId : {
      type : DataTypes.INTEGER
    },
    optionId : {
      type : DataTypes.INTEGER
    },
    orderStatus : {
      type : DataTypes.STRING
    },
    status : {
      type : DataTypes.STRING
    },
    totalPayAmount : {
      type : DataTypes.INTEGER
    },
    password : {
      type : DataTypes.STRING
    },
    buyer_email : {
      type : DataTypes.STRING
    },
    buyer_name : {
      type : DataTypes.STRING
    },
    buyer_tel : {
      type : DataTypes.STRING
    },
    buyer_addr : {
      type : DataTypes.STRING
    },
    buyer_postcode : {
      type : DataTypes.STRING
    },
    Recipient_name : {
      type : DataTypes.STRING
    },
    Recipient_addr : {
      type : DataTypes.STRING
    },
    Recipient_postcode : {
      type : DataTypes.STRING
    },
    Recipient_tel : {
      type : DataTypes.STRING
    },
    vbank_num : {
      type : DataTypes.STRING
    },
    vbank_date : {
      type : DataTypes.STRING
    },
    vbank_name : {
      type : DataTypes.STRING
    },
    deliveryMessage : {
      type : DataTypes.TEXT
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

  Checkouts.associate = function(models){
    Checkouts.belongsTo(models.Users);
    Checkouts.hasMany(models.Carts);
  }
  
  return Checkouts;
};