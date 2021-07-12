const controller = require("../controllers/order.controller");
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
    "/api/order/create",
    // [globalFunction.checkDuplicateOrderNameOnCreate],
    controller.create
  );

  app.post("/api/order/get", controller.get_list);

  app.post(
    "/api/order/update",
    // [globalFunction.checkDuplicateOrderNameOnUpdate],
    controller.update
  );

  app.post("/api/order/set_status", controller.set_status);

  app.post("/api/order/delete", controller.delete);
};
