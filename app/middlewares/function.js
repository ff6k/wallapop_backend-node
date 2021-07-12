const db = require("../models");
const WorkPoint = db.workpoint;

checkDuplicateWorkpointName = (req, res, next) => {
  // Username
  WorkPoint.findOne({
    where: {
      name: req.body.name,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! This name is already in use!",
      });
      return;
    }
  });
  next();
};

checkDuplicateDepartmentOnCreate = (req, res, next) => {
  // Username
  db.workplace
    .findOne({
      where: {
        department_id: req.body.department_id,
      },
    })
    .then((data) => {
      if (data) {
        return res.status(400).send({
          message: "Failed! This department is already in use!",
        });
      }
    });
  next();
};

checkDuplicateDepartmentOnUpdate = async (req, res, next) => {
  const workplace = await db.workplace.findOne({
    where: {
      department_id: req.body.department_id,
    },
  });
  if (workplace) {
    if (
      !(
        workplace.dataValues.id == req.body.id &&
        workplace.dataValues.department_id == req.body.department_id
      )
    ) {
      console.log("Failed! This department is already in use!");
      return res.status(400).send({
        message: "Failed! This department is already in use!",
      });
    }
  }
  next();
};

checkDuplicateWorkPointNameOnCreate = async (req, res, next) => {
  const workpoint = await db.workpoint.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (workpoint) {
    return res.status(400).send({
      message: "Failed! This WorkPoint name is already in use!",
    });
  }
  next();
};

checkDuplicateWorkPointNameOnUpdate = async (req, res, next) => {
  const workpoint = await db.workpoint.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (workpoint) {
    if (
      !(
        workpoint.dataValues.id == req.body.id &&
        workpoint.dataValues.name == req.body.name
      )
    ) {
      return res.status(400).send({
        message: "Failed! This WorkPoint name is already in use!",
      });
    }
  }
  next();
};

checkDuplicateWorkPlaceNameOnCreate = async(req, res, next) => {
  const workplace = await db.workplace.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (workplace) {
    return res.status(400).send({
      message: "Failed! This WorkPlace name is already in use!",
    });
  }
  next();
};

checkDuplicateWorkPlaceNameOnUpdate = async (req, res, next) => {
  const workplace = await db.workplace.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (workplace) {
    if (
      !(
        workplace.dataValues.id == req.body.id &&
        workplace.dataValues.name == req.body.name
      )
    ) {
      return res.status(400).send({
        message: "Failed! This WorkPlace name is already in use!",
      });
    }
  }
  next();
};

checkDuplicateDepartmentNameOnCreate = async (req, res, next) => {
  const department = await db.department.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (department) {
    return res.status(400).send({
      message: "Failed! This Department name is already in use!",
    });
  }
  next();
};

checkDuplicateDepartmentNameOnUpdate = async (req, res, next) => {
  const department = await db.department.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (department) {
    if (
      !(
        department.dataValues.id == req.body.id &&
        department.dataValues.name == req.body.name
      )
    ) {
      return res.status(400).send({
        message: "Failed! This Department name is already in use!",
      });
    }
  }
  next();
};

checkDuplicateProviderNameOnCreate = async (req, res, next) => {
  const provider = await db.providers.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (provider) {
    return res.status(400).send({
      message: "Failed! This Provider name is already in use!",
    });
  }
  next();
};

checkDuplicateProviderNameOnUpdate = async (req, res, next) => {
  const provider = await db.providers.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (provider) {
    if (
      !(
        provider.dataValues.id == req.body.id &&
        provider.dataValues.name == req.body.name
      )
    ) {
      return res.status(400).send({
        message: "Failed! This Provider name is already in use!",
      });
    }
  }
  next();
};

checkDuplicateOrderNameOnCreate = async (req, res, next) => {
  const provider = await db.providers.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (provider) {
    return res.status(400).send({
      message: "Failed! This Provider name is already in use!",
    });
  }
  next();
};

checkDuplicateOrderNameOnUpdate = async (req, res, next) => {
  const provider = await db.providers.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (provider) {
    if (
      !(
        provider.dataValues.id == req.body.id &&
        provider.dataValues.name == req.body.name
      )
    ) {
      return res.status(400).send({
        message: "Failed! This Provider name is already in use!",
      });
    }
  }
  next();
};

checkDuplicateServiceNameOnCreate = async (req, res, next) => {
  const provider = await db.providers.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (provider) {
    return res.status(400).send({
      message: "Failed! This Provider name is already in use!",
    });
  }
  next();
};

checkDuplicateServiceNameOnUpdate = async (req, res, next) => {
  const provider = await db.providers.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (provider) {
    if (
      !(
        provider.dataValues.id == req.body.id &&
        provider.dataValues.name == req.body.name
      )
    ) {
      return res.status(400).send({
        message: "Failed! This Provider name is already in use!",
      });
    }
  }
  next();
};

const globalFunction = {
  checkDuplicateWorkpointName: checkDuplicateWorkpointName,
  checkDuplicateDepartmentOnUpdate: checkDuplicateDepartmentOnUpdate,
  checkDuplicateDepartmentOnCreate: checkDuplicateDepartmentOnCreate,
  checkDuplicateWorkPointNameOnCreate: checkDuplicateWorkPointNameOnCreate,
  checkDuplicateWorkPointNameOnUpdate: checkDuplicateWorkPointNameOnUpdate,
  checkDuplicateWorkPlaceNameOnCreate: checkDuplicateWorkPlaceNameOnCreate,
  checkDuplicateDepartmentNameOnUpdate: checkDuplicateDepartmentNameOnUpdate,
  checkDuplicateDepartmentNameOnCreate: checkDuplicateDepartmentNameOnCreate,
  checkDuplicateProviderNameOnCreate: checkDuplicateProviderNameOnCreate,
  checkDuplicateProviderNameOnUpdate: checkDuplicateProviderNameOnUpdate,
  checkDuplicateOrderNameOnCreate: checkDuplicateOrderNameOnCreate,
  checkDuplicateOrderNameOnUpdate: checkDuplicateOrderNameOnUpdate,
  checkDuplicateServiceNameOnCreate: checkDuplicateServiceNameOnCreate,
  checkDuplicateSerivceNameOnUpdate: checkDuplicateServiceNameOnUpdate,
};

module.exports = globalFunction;
