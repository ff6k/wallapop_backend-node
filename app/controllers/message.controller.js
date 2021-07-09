const db = require("../models");
const Message = db.message;

exports.sendMessages = (req, res) => {
  const ids = req.body.ids;
  for (var i = 0; i < ids.length; i++) {
    Message.create({
      from: req.body.from,
      to: ids[i],
      message: req.body.message,
    })
      .then(() => { })
      .catch((err) => {
        res.status(500).send({
          message: "Error sending messages with id=" + ids[i],
        });
        return;
      });
  }

  res.send({
    message: "Sending messages successfully.",
  });
};

exports.readMessage = (req, res) => {
  const id = req.body.id;
  Message.update({ read: 1 }, {
    where: {
      id: id
    }
  }).then(() => {
    return res.send({ message: "messages updated successfully" })
  }).catch((err) => {
    res.status(500).send({
      message: "Error messages updating with id=" + id,
    });
    return;
  })
}