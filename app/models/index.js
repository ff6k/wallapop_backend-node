const config = require("../config/config.js");
const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  config.db.DB_NAME,
  config.db.DB_USER,
  config.db.DB_PASS,
  {
    host: config.db.DB_HOST,
    dialect: config.db.dialect,
    operatorsAliases: false,

    poll: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle,
    },
  },
  
);

const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

db.books = require("./book.model.js")(sequelize, Sequelize, DataTypes);
db.user = require("./user.model.js")(sequelize, Sequelize, DataTypes);
db.message = require("./message.model.js")(sequelize, Sequelize, DataTypes);
db.workpoint = require("./workpoint.model.js")(sequelize, Sequelize, DataTypes);
db.workplace = require("./workplace.model.js")(sequelize, Sequelize, DataTypes);
db.department = require("./department.model.js")(sequelize, Sequelize, DataTypes);

db.workpoint.belongsTo(db.user, {
  through: "users",
  foreignKey: "admin_id",
  otherKey: "id"
});

db.department.belongsTo(db.workplace, {
  through: "workplaces",
  as:"workplace",
  foreignKey: "id",
  otherKey: 'department_id'
})

db.workplace.belongsTo(db.workpoint, {
  through: "workpoints",
  as:"workpoint",
  foreignKey: "workpoint_id",
  otherKey: 'id'
})

db.workplace.belongsTo(db.user, {
  through: "users",
  as:"manager",
  foreignKey: "manager_id",
  otherKey: 'id'
})

db.workplace.belongsTo(db.department, {
  through: "departments",
  as:"department",
  foreignKey: "department_id",
  otherKey: 'id'
})

db.message.belongsTo(db.user, {
  through: "users",
  as: "user",
  foreignKey: "from",
  otherKey: 'id'
})
// db.workpoint.hasMany(db.user);
// db.role = require("./role.model.js")(sequelize, Sequelize, DataTypes);

// db.role.belongsToMany(db.user, {
//   through: "user_roles",
//   foreignKey: "role_id",
//   otherKey: "user_id"
// });
// db.user.belongsToMany(db.role, {
//   through: "user_roles",
//   foreignKey: "user_id",
//   otherKey: "role_id"
// });

// db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
