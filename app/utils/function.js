const db = require("../models");

const getRole = (id) => {
  const role =
    id == 1
      ? "Super Admin"
      : id == 2
      ? "Admin"
      : id == 3
      ? "Manager"
      : id == 4
      ? "Employee"
      : "Wrong";
  return role;
};

const upload = (req, res) => {
  let file;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  file = req.files.image;
  uploadPath =
    __dirname +
    `/../../public/uploads/${req.body.foldername}/` +
    req.body.filename +
    (file.name.includes(".pdf")
      ? ".pdf"
      : file.name.includes(".png")
      ? ".png"
      : file.name.includes(".jpg")
      ? ".jpg"
      : file.name.includes(".jpeg")
      ? ".jpeg"
      : ".png");

  file.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send(
      `/uploads/${req.body.foldername}/` +
        req.body.filename +
        (file.name.includes(".pdf")
          ? ".pdf"
          : file.name.includes(".png")
          ? ".png"
          : file.name.includes(".jpg")
          ? ".jpg"
          : file.name.includes(".jpeg")
          ? ".jpeg"
          : ".png")
    );
  });
};

async function getMemberByIdString(string) {
  const ids = string.split(",");
  result = [];
  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    const user = await db.user.findOne({ where: { id: id } });
    result.push({
      id: user.dataValues.id,
      username: user.dataValues.username,
      // photo_url: user.dataValues.photo_url,
    });
  }
  return result;
}

async function getMemberProfileImageByIdString(string) {
  const ids = string.split(",");
  result = [];
  return new Promise(async function (resolve, reject) {
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      const user = await db.user.findOne({ where: { id: id } });
      result.push(user.dataValues.photo_url);
    }
    resolve(result);
  });
}

async function getAdminAndMangerInfoByWorkSpaceId(id) {
  const workplace = await db.workplace.findOne({
    where: {
      department_id: id,
    },
  });
  if (workplace) {
    const workpoint = await db.workpoint.findOne({
      where: { id: workplace.dataValues.workpoint_id },
    });
    const admin = await db.user.findOne({
      where: { id: workpoint.dataValues.admin_id },
    });
    const manager = await db.user.findOne({
      where: { id: workplace.dataValues.manager_id },
    });
    return {
      admin: admin.dataValues.username,
      manager: manager.dataValues.username,
    };
  } else {
    return {
      admin: "",
      manager: "",
    };
  }
}

async function getUserInfoById(id) {
  const user = await db.user.findOne({
    where: {
      id: id,
    },
  });
  return user.dataValues;
}

module.exports = {
  getRole,
  upload,
  getMemberByIdString,
  getMemberProfileImageByIdString,
  getAdminAndMangerInfoByWorkSpaceId,
  getUserInfoById,
};
