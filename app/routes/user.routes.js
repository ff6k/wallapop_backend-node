const { authJwt } = require("../middlewares");
const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post(
    "/api/user/create",
    [verifySignUp.checkDuplicateUsernameOrEmailOnCreate],
    controller.create
  );

  app.get("/api/user/getall", controller.findAll);

  app.post(
    "/api/user/update",
    [verifySignUp.checkDuplicateUsernameOrEmailOnUpdate],
    controller.update
  );

  app.post("/api/user/set_status", controller.set_status);

  app.post("/api/user/delete", controller.delete);

  app.post("/api/user/get", controller.get);

  app.post("/api/user/users_by_role", controller.getUsersByRole);
};
