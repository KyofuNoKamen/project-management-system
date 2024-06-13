const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('project_management', 'project_user', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
