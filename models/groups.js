'use strict';
module.exports = function(sequelize, DataTypes) {
  var groups = sequelize.define('groups', {
    title: DataTypes.STRING,
    time: DataTypes.STRING,
    location: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.groups.hasMany(models.recommendations);
        models.groups.belongsToMany(models.users, { through: 'usersGroups' });
      }
    }
  });
  return groups;
};
