'use strict';
module.exports = function(sequelize, DataTypes) {
  var recommendations = sequelize.define('recommendations', {
    groupId: DataTypes.INTEGER,
    restName: DataTypes.STRING,
    rate: DataTypes.INTEGER,
    url: DataTypes.STRING,
    thumbup: DataTypes.INTEGER,
    thumbdown: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.recommendations.belongsTo(models.groups);
      }
    }
  });
  return recommendations;
};
