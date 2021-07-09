const db = require("../models");
const WorkPoint = db.workpoint;
const moment = require("moment");

function filter(data) {
  const result = [];
  data.map(({ dataValues }) => {
    const { is_active, is_delete, user, created_at, updated_at } = dataValues;
    dataValues = {
      ...dataValues,
      created_at: moment(created_at).format("YYYY-MM-DD"),
      updated_at: moment(updated_at).format("YYYY-MM-DD"),
    };

    if (user) dataValues["admin_str"] = user.email;
    dataValues["is_active_str"] = is_active == 1 ? "Active" : "Deactive";
    dataValues["is_delete_str"] = is_delete == 1 ? "Deleted" : "";
    result.push(dataValues);
  });
  return result;
}

exports.create = (req, res) => {
  // Save user to database
  WorkPoint.create({
    logo_url: req.body.logo_url,
    name: req.body.name,
    address: req.body.address,
    zip_code: req.body.zip_code,
    description: req.body.description,
    admin_id: req.body.admin_id,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.get_list = (req, res) => {
  const flag = req.body.flag;
  let condition;
  let include = [
    {
      model: db.user,
    },
  ];
  condition =
    flag == "all"
      ? { include }
      : flag == "deactivated"
      ? { where: { is_delete: 0 }, include }
      : flag == "deleted"
      ? { where: { is_active: 1 }, include }
      : flag == "default"
      ? {
          where: {
            is_active: 1,
            is_delete: 0,
          },
          include,
        }
      : { include };
  WorkPoint.findAll(condition)
    .then(function (data) {
      res.send(filter(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  const id = req.body.id;
  WorkPoint.update(req.body, {
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Workpoint data was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Workpoint with id=${id}. Maybe Workpoint was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Workpoint with id=" + id,
      });
    });
};

exports.set_status = (req, res) => {
  const { ids, is_active, is_delete } = req.body;

  let query = {};
  if (typeof is_active != "undefined") query.is_active = is_active;
  if (typeof is_delete != "undefined") query.is_delete = is_delete;
  WorkPoint.update(query, {
    where: {
      id: {
        [db.Op.or]: ids,
      },
    },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: "Workpoint status was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Workpoint with ids. Maybe Workpoint was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Workpoint with ids",
      });
    });
};

exports.delete = async (req, res, next) => {
  const ids = req.body.ids;
  let flag = true;

  for (var i = 0; i < ids.length; i++) {
    let num = await WorkPoint.update(
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
      message: "Workpoint was deleted successfully.",
    });
  } else {
    res.status(500).send({
      message: "Error deleting Workpoint",
    });
  }
};
