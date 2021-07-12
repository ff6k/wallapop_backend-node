const controller = require("../controllers/providers.controller");
const { globalFunction } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/providers/create",
    [globalFunction.checkDuplicateProviderNameOnCreate],
    controller.create
  );

  app.post("/api/providers/get", controller.get_list);

  app.post(
    "/api/providers/update",
    [globalFunction.checkDuplicateProviderNameOnUpdate],
    controller.update
  );

  app.post("/api/providers/set_status", controller.set_status);

  app.post("/api/providers/delete", controller.delete);
};
