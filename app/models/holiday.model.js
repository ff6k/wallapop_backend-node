module.exports = (sequelize, Sequelize, DataTypes) => {
  const Holiday = sequelize.define(
    "holidays", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      year: {
        type: DataTypes.NUMBER,
      },
      month: {
        type: DataTypes.NUMBER,
      },
      workplace_id: {
        type: DataTypes.STRING,
      },
      department_id: {
        type: DataTypes.STRING,
      },
      employee_id: {
        type: DataTypes.STRING,
      },      
      holidays: {
        type: DataTypes.STRING,
      },
      local_holidays: {
        type: DataTypes.STRING,
      },
      national_holidays: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.NUMBER,
      },
      is_active: {
        type: DataTypes.NUMBER,
      },
      is_delete: {
        type: DataTypes.NUMBER,
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

  return Holiday;
};
