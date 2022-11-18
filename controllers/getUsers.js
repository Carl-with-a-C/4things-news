const { fetchUsers } = require("../models/fetchUsers");

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.send({ users });
  });
};
