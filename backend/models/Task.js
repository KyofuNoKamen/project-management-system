module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assignedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, { as: 'assignedUser', foreignKey: 'assignedUserId' });
  };

  return Task;
};
