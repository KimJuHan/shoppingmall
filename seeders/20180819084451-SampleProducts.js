'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [{
      name: 'mango',
      thumbnail: 'macbook2.jpg'
    }, {name: 'koo', thumbnail: 'macbook1.jpg'}, { name: 'kjh', thumbnail: 'macbook2.jpg'}], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
