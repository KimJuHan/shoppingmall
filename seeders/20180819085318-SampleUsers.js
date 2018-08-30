'use strict';
var faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
      var users = [];
      for(let i=0; i < 100; i++){
        users.push({
          userId: faker.internet.email(),
          password: faker.internet.password()
        })
      }
      return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
