'use strict';
module.exports = function(sequelize, DataTypes) {
  var usersGroups = sequelize.define('usersGroups', {
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return usersGroups;
};