const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const { decrypt } = require("../utils/crypto");
const { getRole } = require("../utils/function");
const User = db.user;

function compare(unhashed, hashed) {
  const [iv, content] = hashed.split("||");
  if (decrypt({ iv, content }) == unhashed) return true;
  else return false;
}

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(200).send({
          error: [
            {
              type: "email",
              message: "Check your email address",
            },
          ],
        });
      }

      let passwordIsValid = compare(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(200).send({
          accessToken: null,
          error: [
            {
              type: "password",
              message: "Check your password",
            },
          ],
        });
      }

      if (user.is_active == 0 || user.is_delete == 1) {
        return res.status(200).send({
          accessToken: null,
          error: [
            {
              type: "email",
              message: "User was suspended or deleted. Support to admin",
            },
          ],
        });
      }

      if(user.role == 4 ){
        return res.status(200).send({
          accessToken: null,
          error: [
            {
              type: "email",
              message: "User don't have permission",
            },
          ],
        });
      }

      let token = jwt.sign({ id: user.id }, config.auth.secret, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        role: getRole(user.role),
        photoURL: user.photo_url,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signinwithtoken = (req, res) => {
  const token = req.body.access_token;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.auth.secret, (err, { id }) => {
    if (err) return res.status(403).send({ message: err });
    let token = jwt.sign({ id }, config.auth.secret, {
      expiresIn: 86400, // 24 hours
    });

    User.findOne({
      where: {
        id,
      },
    })
      .then((user) => {
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          role: getRole(user.role),
          photoURL: user.photo_url,
          accessToken: token,
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  });
};
