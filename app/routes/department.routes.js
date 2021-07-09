const controller = require("../controllers/department.controller");
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
    "/api/department/create",
    [globalFunction.checkDuplicateDepartmentNameOnCreate],
    controller.create
  );

  app.post("/api/department/get", controller.get_list);

  app.post(
    "/api/department/update",
    [globalFunction.checkDuplicateDepartmentNameOnUpdate],
    controller.update
  );

  app.post("/api/department/set_status", controller.set_status);

  app.post("/api/department/delete", controller.delete);
};
