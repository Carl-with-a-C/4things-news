const { fetchTopics } = require("../models/fetchTopics");

exports.getTopics = (req, res) => {
  fetchTopics().then((fetchedTopics) => {
    res.send({ topics: fetchedTopics });
  });
};
