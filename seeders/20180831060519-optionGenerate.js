'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Options', [{
        price: 1000,
        description: '업그레이드사양A',
        ProductId: 20
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Options', null, {});
  }
};
