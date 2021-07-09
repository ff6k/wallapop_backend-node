const db = require("../models");
const Department = db.department;
const moment = require("moment");
let delaytime = 0;
const {
  getMemberByIdString,
  getMemberProfileImageByIdString,
  getAdminAndMangerInfoByWorkSpaceId,
} = require("../utils/function");

async function filter(data) {
  const result = [];
  return new Promise(async function (resolve, reject) {
    for (var i = 0; i < data.length; i++) {
      let dataValues = data[i]["dataValues"];
      const { id, is_active, is_delete, created_at, updated_at, employee_ids } =
        dataValues;
      dataValues = {
        ...dataValues,
        created_at: moment(created_at).format("YYYY-MM-DD"),
        updated_at: moment(updated_at).format("YYYY-MM-DD"),
      };
      dataValues["emp_photos"] = await getMemberProfileImageByIdString(
        employee_ids
      );
      dataValues["emp_info"] = await getMemberByIdString(employee_ids);
      const { admin, manager } = await getAdminAndMangerInfoByWorkSpaceId(id);
      dataValues["admin_str"] = admin;
      dataValues["manager_str"] = manager;
      dataValues["is_active_str"] = is_active == 1 ? "Active" : "Deactive";
      dataValues["is_delete_str"] = is_delete == 1 ? "Deleted" : "";
      result.push(dataValues);
    }
    resolve(result);
  })
}

exports.create = (req, res) => {
  // Save user to database
  Department.create({
    name: req.body.name,
    description: req.body.description,
    employee_ids: req.body.employee_ids,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.get_list = (req, res) => {  
  delaytime = delaytime < 2 ? delaytime + 4 : 0
  setTimeout(() => {
    const flag = req.body.flag;
    let condition;
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

    Department.findAll(condition)
      .then(async (data) => {
        const d = await filter(data);
        res.send(d);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }, delaytime * 1000)
};

exports.update = (req, res) => {
  const id = req.body.id;
  Department.update(req.body, {
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Department data was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Department with id=${id}. Maybe Workpoint was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Department with id=" + id,
      });
    });
};

exports.set_status = (req, res) => {
  const { ids, is_active, is_delete } = req.body;

  let query = {};
  if (typeof is_active != "undefined") query.is_active = is_active;
  if (typeof is_delete != "undefined") query.is_delete = is_delete;
  Department.update(query, {
    where: {
      id: {
        [db.Op.or]: ids,
      },
    },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: "Department status was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Department with ids. Maybe Workpoint was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Department with ids",
      });
    });
};

exports.delete = async (req, res) => {
  const ids = req.body.ids;
  let flag = true;

  for (var i = 0; i < ids.length; i++) {
    let num = await Department.update(
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
      message: "Department was deleted successfully.",
    });
  } else {
    res.status(500).send({
      message: "Error deleting Department. Maybe already deleted.",
    });
  }
};
