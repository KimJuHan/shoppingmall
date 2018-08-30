'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notices = sequelize.define('Notices', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  });
  return Notices;
};