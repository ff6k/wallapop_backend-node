module.exports = (sequelize, Sequelize, DataTypes) => {
  const Message = sequelize.define(
    "message", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      from: {
        type: DataTypes.STRING,
      },
      to: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.STRING,
      },
      read: {
        type: DataTypes.NUMBER
      }
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Message;
};
