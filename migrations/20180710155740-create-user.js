'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      cartList: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      mobile: {
        type : Sequelize.STRING
      },
      postCode : {
        type: Sequelize.STRING
      },
      addressCode : {
        type: Sequelize.STRING
      },
      emailConsent : {
        type : Sequelize.STRING
      },
      smsConsent : {
        type: Sequelize.INTEGER
      },
      class : {
        type: Sequelize.STRING
      },
      mileage : { 
        type: Sequelize.INTEGER
      },
      deliveryAddress : {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Users');
  }
};