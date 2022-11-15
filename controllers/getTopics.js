const { fetchTopics } = require("../models/fetchTopics");

exports.getTopics = (req, res) => {
  fetchTopics().then((fetchedTopics) => {
    console.log(fetchedTopics);
    res.send({ topics: fetchedTopics });
  });
};
