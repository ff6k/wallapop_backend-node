const db = require("../models");
const Order = db.order;
const moment = require("moment");

function filter(data) {
  const result = [];
  data.map(({ dataValues }) => {
    const { is_active, is_delete, provider, created_at, updated_at } = dataValues;
    dataValues = {
      ...dataValues,
      created_at: moment(created_at).format("YYYY-MM-DD"),
      updated_at: moment(updated_at).format("YYYY-MM-DD"),
    };

    if (provider) dataValues["provider_str"] = provider.email;
    dataValues["is_active_str"] = is_active == 1 ? "Active" : "Deactive";
    dataValues["is_delete_str"] = is_delete == 1 ? "Deleted" : "";
    result.push(dataValues);
  });
  return result;
}

exports.create = (req, res) => {
  // Save provider to database
  Order.create({
    number: req.body.number,
    type: req.body.type,
    address: req.body.address,
    observation: req.body.observation,
    deadline: req.body.deadline,
    state:req.body.state,
    provider_id: req.body.provider_id,
  })
    .then((provider) => {
      res.send(provider);
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
      model: db.providers,
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
  Order.findAll(condition)
    .then(function (data) {
      res.send(filter(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  const id = req.body.id;
  Order.update(req.body, {
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Order data was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Order with id=" + id,
      });
    });
};

exports.set_status = (req, res) => {
  const { ids, is_active, is_delete } = req.body;

  let query = {};
  if (typeof is_active != "undefined") query.is_active = is_active;
  if (typeof is_delete != "undefined") query.is_delete = is_delete;
  Order.update(query, {
    where: {
      id: {
        [db.Op.or]: ids,
      },
    },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: "Order status was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Order with ids. Maybe Order was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Order with ids",
      });
    });
};

exports.delete = async (req, res, next) => {
  const ids = req.body.ids;
  let flag = true;

  for (var i = 0; i < ids.length; i++) {
    let num = await Order.update(
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
      message: "Order was deleted successfully.",
    });
  } else {
    res.status(500).send({
      message: "Error deleting Order",
    });
  }
};
