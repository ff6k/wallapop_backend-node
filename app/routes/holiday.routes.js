const controller = require("../controllers/holiday.controller");
const { globalFunction } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/holiday/create", controller.create);

  app.post("/api/holiday/get", controller.get_list);

  app.post("/api/holiday/update", controller.update);

  app.post("/api/holiday/set_status", controller.set_status);

  app.post("/api/holiday/delete", controller.delete);
};
