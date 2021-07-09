const db = require("../models");
const User = db.user;
const { encrypt, decrypt } = require("../utils/crypto");
const { getRole } = require("../utils/function");
const moment = require("moment");

function userFilter(users) {
  const result = [];
  users.map(({ dataValues }) => {
    const { password, created_at, updated_at, role, is_active, is_delete } =
      dataValues;
    let [iv, content] = password.split("||");
    dataValues = {
      ...dataValues,
      password: decrypt({ iv, content }),
      role: role,
      is_active: is_active,
      created_at: moment(created_at).format("YYYY-MM-DD"),
      updated_at: moment(updated_at).format("YYYY-MM-DD"),
    };
    dataValues["role_str"] = getRole(role);
    dataValues["is_active_str"] = is_active == 1 ? "Active" : "Deactive";
    dataValues["is_delete_str"] = is_delete == 1 ? "Deleted" : "";
    result.push(dataValues);
  });
  return result;
}

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.create = (req, res) => {
  const pass = encrypt(req.body.password);

  // Save user to database
  User.create({
    // username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    lastname: req.body.lastname,
    secondname: req.body.secondname,
    telephone: req.body.telephone,
    number: req.body.number,
    address: req.body.address,
    role: req.body.role,
    password: pass.iv + "||" + pass.content,
    photo_url: req.body.photo_url,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAll = (req, res) => {
  User.findAll({
    where: {
      is_active: 1,
      is_delete: 0,
    },
  })
    .then(function (users) {
      res.send(userFilter(users));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  const id = req.body.id;
  const pass = encrypt(req.body.password);
  let user = req.body;
  user = { ...user, password: pass.iv + "||" + pass.content };
  User.update(user, {
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User data was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

exports.get = (req, res) => {
  let condition;
  let flag = req.body.flag;
  condition =
    flag == "all"
      ? {}
      : flag == "deactivated"
      ? { where: { is_delete: 0 } }
      : flag == "deleted"
      ? { where: { is_active: 1 } }
      : flag == "default"
      ? {
          where: {
            is_active: 1,
            is_delete: 0,
          },
        }
      : {};
  User.findAll(condition)
    .then(function (users) {
      res.send(userFilter(users));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
  // User.findOne({
  //   where: {
  //     id: req.userId,
  //   },
  // })
  //   .then(function (user) {
  //     console.log(user);
  //     if (user.role == 1) {
  //       //super admin
  //       condition =
  //         flag == "all"
  //           ? {}
  //           : flag == "deactivated"
  //           ? { where: { is_delete: 0 } }
  //           : flag == "deleted"
  //           ? { where: { is_active: 1 } }
  //           : flag == "default"
  //           ? {
  //               where: {
  //                 is_active: 1,
  //                 is_delete: 0,
  //               },
  //             }
  //           : {};
  //       User.findAll(condition)
  //         .then(function (users) {
  //           res.send(userFilter(users));
  //         })
  //         .catch((err) => {
  //           res.status(500).send({ message: err.message });
  //         });
  //     } else if (user.role == 2) {
  //       //admin
  //       let result = "";
  //       db.workpoint
  //         .findAll({
  //           where: {
  //             admin_id: user.id,
  //           },
  //         })
  //         .then(function (workpoints) {
  //           for (var i = 0; i < workpoints.length; i++) {
  //             let workpoint = workpoints[i]["dataValues"];
  //             db.workplace
  //               .findAll({
  //                 where: {
  //                   workpoint_id: workpoint.id,
  //                 },
  //               })
  //               .then(function (workplaces) {
  //                 for (var a = 0; a < workplaces.length; a++) {
  //                   result =
  //                     result + "," + workplaces[a]["dataValues"].manager_id;
  //                   let workplace = workplaces[i]["dataValues"];
  //                   db.department
  //                     .findAll({
  //                       where: { id: workplace.department_id },
  //                     })
  //                     .then(function (department) {
  //                       result = result + "," + workplaces[a]["dataValues"].manager_id;
  //                     })
  //                     .catch((err) => {
  //                       res.status(500).send({ message: err.message });
  //                     });
  //                 }
  //               })
  //               .catch((err) => {
  //                 res.status(500).send({ message: err.message });
  //               });
  //           }
  //         })
  //         .catch((err) => {
  //           res.status(500).send({ message: err.message });
  //         });
  //     }
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: err.message });
  //   });
  // const flag = req.body.flag;
  // let condition;
  // condition =
  //   flag == "all"
  //     ? {}
  //     : flag == "deactivated"
  //     ? { where: { is_delete: 0 } }
  //     : flag == "deleted"
  //     ? { where: { is_active: 1 } }
  //     : flag == "default"
  //     ? {
  //         where: {
  //           is_active: 1,
  //           is_delete: 0,
  //         },
  //       }
  //     : {};
  // User.findAll(condition)
  //   .then(function (users) {
  //     res.send(userFilter(users));
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: err.message });
  //   });
};

exports.set_status = (req, res) => {
  const { ids, is_active, is_delete } = req.body;

  let query = {};
  if (typeof is_active != "undefined") query.is_active = is_active;
  if (typeof is_delete != "undefined") query.is_delete = is_delete;
  User.update(query, {
    where: {
      id: {
        [db.Op.or]: ids,
      },
    },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: "Users status was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Users with ids. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Users with id",
      });
    });
};

exports.delete = async (req, res, next) => {
  const ids = req.body.ids;
  let flag = true;

  for (var i = 0; i < ids.length; i++) {
    const num = await User.update(
      { is_delete: 1 },
      {
        where: {
          id: ids[i],
        },
      }
    );
    if (num[0] != 1) {
      flag = false;
    }
  }
  if (flag) {
    res.send({
      message: "Users was deleted successfully.",
    });
  } else {
    res.status(500).send({
      message: "Error deleting User",
    });
  }
};

exports.getUsersByRole = (req, res) => {
  User.findAll({
    where: {
      role: req.body.role,
      is_active: 1,
      is_delete: 0,
    },
  })
    .then(function (users) {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.upload = (req, res) => {
  let file;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  file = req.files.image;
  uploadPath =
    __dirname +
    "/../../public/uploads/user_profile/" +
    req.body.username +
    (file.name.includes(".png")
      ? ".png"
      : file.name.includes(".jpg")
      ? ".jpg"
      : file.name.includes(".jpeg")
      ? ".jpeg"
      : ".png");

  file.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send(
      "/uploads/user_profile/" +
        req.body.username +
        (file.name.includes(".png")
          ? ".png"
          : file.name.includes(".jpg")
          ? ".jpg"
          : file.name.includes(".jpeg")
          ? ".jpeg"
          : ".png")
    );
  });
};
