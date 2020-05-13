var express = require('express');
const UserSchema = require("../schemas/UserSchema");
var router = express.Router();

router.post('/', (req, res) => {
  const newUser = new UserSchema({
    name: req.body.name,
    number: req.body.number
  });
  newUser.save().then(item => {
    res.status(200).send('User Created'); Î
  }).catch(e => {
    res.status(500).send("Internal error", e)
  })
});

router.get("/", function (req, res) {
  var pageNo = parseInt(req.query.page)
  var size = parseInt(req.query.limit)
  var query = {}
  if (pageNo < 0 || pageNo === 0) {
    response = {"message": "Page Should be a number and should start with 1" };
    return res.json(response)
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;

  //Model.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
  UserSchema.find({}, {}, query, function (err, data) {
    response = err ?
      { "message": "Error occured while fetching data" } :
      { "message": data };
    res.json(response);
  });
})

module.exports = router;
