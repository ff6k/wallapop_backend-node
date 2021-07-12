module.exports = (sequelize, Sequelize, DataTypes) => {
  const Service = sequelize.define(
    "services", // Model name
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
      direction: {
        type: DataTypes.STRING,
      },      
      workpoint_id: {
        type: DataTypes.STRING,
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

  return Service;
};
