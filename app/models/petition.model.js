module.exports = (sequelize, Sequelize, DataTypes) => {
  const Petition = sequelize.define(
    "petitions", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },     
      workplace_id: {
        type: DataTypes.STRING,
      },
      employee_id: {
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

  return Petition;
};
