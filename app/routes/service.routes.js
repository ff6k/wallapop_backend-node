const controller = require("../controllers/service.controller");
const { globalFunction } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/service/create", [globalFunction.checkDuplicateServiceNameOnCreate], controller.create);

  app.post("/api/service/get", controller.get_list);

  app.post(
    "/api/service/update",
    [globalFunction.checkDuplicateWorkPointNameOnUpdate],
    controller.update
  );

  app.post("/api/service/set_status", controller.set_status);

  app.post("/api/service/delete", controller.delete);
};
