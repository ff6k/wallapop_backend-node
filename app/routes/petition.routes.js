const controller = require("../controllers/petition.controller");
const { globalFunction } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/petition/create", [globalFunction.checkDuplicatePetitionNameOnCreate], controller.create);

  app.post("/api/petition/get", controller.get_list);

  app.post(
    "/api/petition/update",
    [globalFunction.checkDuplicateWorkPointNameOnUpdate],
    controller.update
  );

  app.post("/api/petition/set_status", controller.set_status);

  app.post("/api/petition/delete", controller.delete);
};
