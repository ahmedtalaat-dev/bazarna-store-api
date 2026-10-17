const Category = require("../models/categoryModel");

const createCategory = (req, res) => {
  const name = req.body.name;
  console.log(req.body);

  const newCategory = new Category({ name });
  newCategory
    .save()
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports = { createCategory };