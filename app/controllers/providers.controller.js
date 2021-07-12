const db = require("../models");
const Providers = db.providers;
const moment = require("moment");

function filter(data) {
  const result = [];
  data.map(({ dataValues }) => {
    const { is_active, is_delete, created_at, updated_at } = dataValues;
    dataValues = {
      ...dataValues,
      created_at: moment(created_at).format("YYYY-MM-DD"),
      updated_at: moment(updated_at).format("YYYY-MM-DD"),
    };

    dataValues["is_active_str"] = is_active == 1 ? "Active" : "Deactive";
    dataValues["is_delete_str"] = is_delete == 1 ? "Deleted" : "";
    result.push(dataValues);
  });
  return result;
}

exports.create = (req, res) => {
  // Save user to database
  Providers.create({
    logo_url: req.body.logo_url,
    name: req.body.name,
    address: req.body.address,
    zip_code: req.body.zip_code,
    telephone: req.body.telephone,
    email: req.body.email,
    contact_name: req.body.contact_name,
    document_urls: req.body.document_urls,
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
  Providers.findAll(condition)
    .then(function (data) {
      res.send(filter(data));
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  const id = req.body.id;
  Providers.update(req.body, {
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Providers data was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Providers with id=${id}. Maybe Providers was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Providers with id=" + id,
      });
    });
};

exports.set_status = (req, res) => {
  const { ids, is_active, is_delete } = req.body;

  let query = {};
  if (typeof is_active != "undefined") query.is_active = is_active;
  if (typeof is_delete != "undefined") query.is_delete = is_delete;
  Providers.update(query, {
    where: {
      id: {
        [db.Op.or]: ids,
      },
    },
  })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: "Providers status was changed successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Providers with ids. Maybe Providers was not found or req.body is not new data!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Providers with ids",
      });
    });
};

exports.delete = async (req, res, next) => {
  const ids = req.body.ids;
  let flag = true;

  for (var i = 0; i < ids.length; i++) {
    let num = await Providers.update(
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
      message: "Providers was deleted successfully.",
    });
  } else {
    res.status(500).send({
      message: "Error deleting Providers",
    });
  }
};
