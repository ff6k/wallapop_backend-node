const db = require("../models");
const Service = db.service;
const moment = require("moment");
const { getMemberByIdString, getUserInfoById } = require("../utils/function");

async function filter(data) {
  const result = [];
  for (var i = 0; i < data.length; i++) {
    let dataValues = data[i]["dataValues"];
    const { is_active, is_delete, created_at, updated_at, workpoint } =
      dataValues;

    dataValues = {
      ...dataValues,
      created_at: moment(created_at).format("YYYY-MM-DD"),
      updated_at: moment(updated_at).format("YYYY-MM-DD"),
    };

    if (workpoint) { 
      const {user} = workpoint; 
      dataValues = {
        ...dataValues,
        workpoint_id: workpoint.id,
        workpoint_str: workpoint.name,
        admin_id: user.id,
        admin_str: user.email,
      };
    }  

    dataValues["is_active_str"] = is_active == 1 ? "Active" : "Deactive";
    dataValues["is_delete_str"] = is_delete == 1 ? "Deleted" : "";
    result.push(dataValues);
  }
  return result;
}

exports.create = (req, res) => {
  // Save user to database
  Service.create({
    name: req.body.name,
    direction: req.body.direction,
    workpoint_id: req.body.workpoint_id,
  })
    .then((data) => {
      res.send(data);
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
      model: db.workpoint,
      as: "workpoint",
      attributes: {
        exclude: [
          "logo_url",
          "address",
          "zip_code",
          "description",
          "admin_id",
          "is_active",
          "is_delete",
          "created_at",
          "updated_at",
        ],
      },
      include: [
        {
          model: db.user,
          as: "user",
          attributes: {
            exclude: [
              "username",
              "name",
              "lastname",
              "secondname",
              "telephone",
              "number",
              "photo_url",
              "role",
              "address",
              "password",
              "is_active",
              "is_delete",
              "created_at",
              "updated_at",
            ],
          },
        },
      ],
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
  Service.findAll(condition)
    .then(async (data) => {
      const d = await filter(data);
      res.send(d);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  const id = req.body.id;
  Service.update(req.body, {
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Workspace data was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Workspace with id=${id}. Maybe Workpoint was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Workspace with id=" + id,
      });
    });
};

exports.set_status = (req, res) => {
  const { ids, is_active, is_delete } = req.body;

  let query = {};
  if (typeof is_active != "undefined") query.is_active = is_active;
  if (typeof is_delete != "undefined") query.is_delete = is_delete;
  Service.update(query, {
    where: {
      id: {
        [db.Op.or]: ids,
      },
    },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: "Workspace status was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Workspace with ids. Maybe Workpoint was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Workspace with id=" + id,
      });
    });
};

exports.delete = async (req, res) => {
  const ids = req.body.ids;
  let flag = true;

  for (var i = 0; i < ids.length; i++) {
    let num = await Service.update(
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
      message: "Workspace was deleted successfully.",
    });
  } else {
    res.status(500).send({
      message: "Error deleting Workspace. Maybe already deleted.",
    });
  }
};
