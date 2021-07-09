const controller = require("../controllers/workpoint.controller");
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
    "/api/workpoint/create",
    [globalFunction.checkDuplicateWorkPointNameOnCreate],
    controller.create
  );

  app.post("/api/workpoint/get", controller.get_list);

  app.post(
    "/api/workpoint/update",
    [globalFunction.checkDuplicateWorkPointNameOnUpdate],
    controller.update
  );

  app.post("/api/workpoint/set_status", controller.set_status);

  app.post("/api/workpoint/delete", controller.delete);
};
