const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require('path');
const config = require("./app/config/config.js");
const fileUpload = require('express-fileupload');
const { upload } = require("./app/utils/function");

const app = express();

var dir = path.join(__dirname, 'public');

app.use(express.static(dir));

const corsOptions = {
  origin: "*",
}; 

app.use(cors(corsOptions));

app.use(fileUpload());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
// const db = require("./app/models");
// const Role = db.role;
// db.sequelize.sync().then(() => {
//   initial(); // Just use it in development, at the first time execution!. Delete it in production
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hi there, welcome to this tutorial." });
});

app.post("/fileupload", upload);

// api routes
require("./app/routes/book.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/message.routes")(app);
require("./app/routes/workpoint.routes")(app);
require("./app/routes/department.routes")(app);
require("./app/routes/workplace.routes")(app);

// set port, listen for requests
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Just use it in development, at the first time execution!. Delete it in production
// function initial() {
//   Role.create({
//     id: 1,
//     name: "admin"
//   });

//   Role.create({
//     id: 2,
//     name: "staff"
//   });

// }

// omc-10
