module.exports = (sequelize, Sequelize, DataTypes) => {
  const Message = sequelize.define(
    "order", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      number: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.NUMBER,
      },
      observation: {
        type: DataTypes.STRING,
      },
      deadline: {
        type: DataTypes.DATE,
      },  
      state: {
        type: DataTypes.NUMBER,
      },    
      provider_id: {
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

  return Message;
};
