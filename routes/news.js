var express = require('express');
const NewsSchema = require("../schemas/NewsSchema");
var router = express.Router();

router.post('/', (req, res) => {
  const { title, description } = req.body;
  const newsObj = new NewsSchema({
    title: title,
    description: description
  });
  newsObj.save().then(item => {
    res.status(200).send('News Created');
  }).catch(e => {
    res.status(500).send("Internal error", e)
  })
});

router.get("/", async (req, res) => {
  let pageNo = parseInt(req.query.page)
  let size = parseInt(req.query.limit)
  let query = {}
  if (pageNo < 0 || pageNo === 0) {
    response = { "message": "Page Should be a number and should start with 1" };
    return res.status(400).send(response)
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;

  const count = await NewsSchema.countDocuments();

  //Model.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
  NewsSchema.find({}, {}, query, function (err, data) {
    response = err ?
      { "message": "Error occured while fetching data" } :
      { "message": data };
    res.json({
      response,
      totalPages: Math.ceil(count / size) || 0,
      currentPage: pageNo || 1
    });
  });
});

module.exports = router;
