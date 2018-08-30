'use strict';
module.exports = (sequelize, DataTypes) => {
  var Reviews = sequelize.define('Reviews', {
    image: { 
      type : DataTypes.TEXT
    },
    content: {
      type : DataTypes.TEXT
    },
    star : {
      type : DataTypes.INTEGER
    },
    sex : {
      type : DataTypes.STRING
    },
    bestReview : {
      type : DataTypes.BOOLEAN
    }
  });
  Reviews.associate = function(models){
    Reviews.belongsTo(models.Users);
    Reviews.belongsTo(models.Products);
  }
  return Reviews;
};