module.exports = (sequelize, Sequelize, DataTypes) => {
  const Department = sequelize.define(
    "department", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      manager_id: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.STRING,
      },
      is_delete: {
        type: DataTypes.STRING,
      },
      employee_ids: {
        type: DataTypes.STRING,
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    {
      underscored: true,
    }
  );

  return Department;
};
