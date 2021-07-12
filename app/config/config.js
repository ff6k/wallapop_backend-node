module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 8080,

  /** DATABASE */
  db: {
    DB_HOST: "54.232.146.117",
    DB_USER: "pedro",
    DB_PASS: "NC55azZLtCuUs#5Zi00y",
    DB_NAME: "wallapop",
    dialect: "mysql",

    // DB_HOST: "localhost",
    // DB_USER: "root",
    // DB_PASS: "",
    // DB_NAME: "wallapop",
    // dialect: "mysql",

    // pool is optional, it will be used for Sequelize connection pool configuration
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  /** AUTH KEY */
  auth: {
    secret:
      "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611",
  },
};
