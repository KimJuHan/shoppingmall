'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [{
      name: 'mango',
      price: 100,
      sale_price: 100,
      product_num: '11111111111',
      bestProduct : 'on',
      thumbnail: 'macbook2.jpg'
    }],{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
