const { readFile } = require("fs");

exports.getApi = (req, res, next) => {
  return readFile("./endpoints.json", "utf8", (err, endPoints) => {
    const parsedEndpoints = JSON.parse(endPoints);
    if (err) {
      next(err);
    } else {
      res.status(200).send({ endPoints: parsedEndpoints
     });
    }
  });
};
