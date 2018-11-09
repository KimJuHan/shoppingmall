'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [{
      content: 'test',
      star: 3,
      bestReview: true,
      ProductId: 20,
      UserId: 407
    }, {content: 'hi',
    star: 4,
    bestReview: true,
    ProductId: 20,
    UserId: 408}], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reviews', null, {});
  }
};
