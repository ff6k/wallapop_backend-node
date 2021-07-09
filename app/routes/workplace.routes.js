const controller = require("../controllers/workplace.controller");
const { globalFunction } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/workplace/create", [globalFunction.checkDuplicateWorkPlaceNameOnCreate], controller.create);

  app.post("/api/workplace/get", controller.get_list);

  app.post(
    "/api/workplace/update",
    [globalFunction.checkDuplicateWorkPointNameOnUpdate],
    controller.update
  );

  app.post("/api/workplace/set_status", controller.set_status);

  app.post("/api/workplace/delete", controller.delete);
};
