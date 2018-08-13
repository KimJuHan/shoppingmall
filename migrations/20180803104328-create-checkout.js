'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Checkouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      merchant_uid : {
        type : Sequelize.STRING(1200)
      },
      imp_uid : {
        type : Sequelize.STRING(1200)
      },
      name : {
        type : Sequelize.STRING
      },
      amount : {
        type : Sequelize.STRING
      },
      totalPrice : {
        type : Sequelize.STRING
      },
      productImage : {
        type : Sequelize.STRING
      },
      status : {
        type : Sequelize.STRING
      },
      buyer_email : {
        type : Sequelize.STRING
      },
      buyer_name : {
        type : Sequelize.STRING
      },
      buyer_tel : {
        type : Sequelize.STRING
      },
      buyer_addr : {
        type : Sequelize.STRING
      },
      buyer_postcode : {
        type : Sequelize.STRING
      },
      Recipient_name : {
        type : Sequelize.STRING
      },
      Recipient_addr : {
        type : Sequelize.STRING
      },
      Recipient_postcode : {
        type : Sequelize.STRING
      },
      Recipient_tel : {
        type : Sequelize.STRING
      },
      vbank_num : {
        type : Sequelize.STRING
      },
      vbank_date : {
        type : Sequelize.STRING
      },
      vbank_name : {
        type : Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Checkouts');
  }
};